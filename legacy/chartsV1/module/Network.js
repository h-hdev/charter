import Chart from './Chart'
class Network extends Chart {
  parseNode(attr, id) {
    let node = {
      name: attr.name,
      color: attr.fillcolor,
      marker: {
        radius: parseFloat(attr.width) * 10,
        symbol: attr.shape
      }
    }

    if (attr.style !== 'filled') {
      node.marker.lineWidth = 1
      node.marker.lineColor = node.color
      node.color = '#fff'
    }

    if (id !== undefined) {
      node.id = id
    }
    return node
  }

  parseLink(attr) {}
  beforeInit() {
    this.value = {
      name: true
    }
    this.nodeMap = {}
    this.defaultOptions = {
      chart: {
        type: 'networkgraph'
      },
      plotOptions: {
        networkgraph: {
          layoutAlgorithm: {
            approximation: "barnes-hut",
            maxIterations: 2000,
          },
          turboThreshold: 2000,
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            linkFormat: '',
            style: {
              fontSize: '10px'
            }
          }
        }
      }
    }
  }
  translate(options) {
    let nodes = [],
      tempLink,
      links = [],
      nodeMap = {}
    options.body.forEach((body, i) => {
      nodes.push(this.parseNode(body, i))
      nodeMap[body.name] = i
      if (body.links && body.links.length) {
        body.links.forEach((link) => {
          tempLink = {
            from: i,
            name: link.name,
            width: (link?.penwidth ? parseFloat(link.penwidth) : 2) / 2,
            color: link.color
          }
          if (link.dashstyle) {
            tempLink.dashStyle = link.dashstyle
          }
          links.push(tempLink)
        })
      }
    })
    links.forEach((link) => {
      link.to = nodeMap[link.name]
      delete link.name
    })
    this.nodeMap = nodeMap
    // delete options.body
    options.series = [
      {
        // dataLabels: {
        //    enabled: true,
        //    allowOverlap: true,
        //    linkFormat: '',
        //    style: {
        //       fontSize: '10px'
        //    }
        // },
        nodes: nodes,
        data: links
      }
    ]
  }
  setOptions(options, isDefaultOptions) {
    if (isDefaultOptions) {
      this.translate(options)
    }
    super.setOptions(options, isDefaultOptions)
  }

  update(key, value, isDefaultOptions) {
    if (key === 'name') {
      this.value.name = value
      this.chart.series[0].update({
        dataLabels: {
          enabled: this.value.name
        }
      })
      return true
    } else if (key === 'node') {
      let id = this.nodeMap[value.name],
        node = this.chart.series[0].nodes[id],
        attr = {
          marker: {}
        }

      if (value.fillcolor) {
        attr.color = value.fillcolor
      }
      if (value.shape) {
        attr.marker.symbol = value.shape
      }

      if (value.width) {
        attr.marker.radius = value.width
      }

      if (value.style) {
        if (value.style === 'filled') {
          attr.marker.lineWidth = 0
        } else {
          attr.marker.lineWidth = 1
          attr.marker.lineColor = attr.color
          attr.color = '#fff'
        }
      }

      node.update(attr)
      return true
    } else if (key === 'link') {
      let from = this.nodeMap[value.from],
        to = this.nodeMap[value.to],
        i = 0,
        links = this.chart.series[0].points,
        attr = {},
        linkLength = links.length
      for (; i < linkLength; i++) {
        if (links[i].from === from && links[i].to === to) {
          if (value.penwidth) {
            attr.width = value.penwidth
          }
          if (value.color) {
            attr.color = value.color
          }

          if (value.dashstyle) {
            attr.dashStyle = value.dashstyle
          }

          links[i].update(attr)
          return true
        }
      }

      return false
    } else if (key === 'remove-node') {
      let id = this.nodeMap[value]
      if (id !== undefined) {
        this.chart.series[0].nodes[id].remove(false)
        this.chart.series[0].points.forEach((point) => {
          if (point.from === id || point.to === id) {
            point.remove(false)
          }
        })
        this.chart.redraw()
        delete this.nodeMap[value]
        return true
      }

      return false
    }
    super.update(key, value, isDefaultOptions)
  }
}

export default Network
