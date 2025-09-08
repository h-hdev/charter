export interface ICSVParserOptions {
  lineSpator: string;
  dataSpatr: string;
  parser: Record<string, Function>;
  ignoreHeader?: boolean;
}

export default function csvParser(
  input: string,
  options: Partial<ICSVParserOptions>,
) {
  const _options: ICSVParserOptions = {
    lineSpator: "\n",
    dataSpatr: ",",
    parser: {},
    ...options,
  };

  let headers: string[] = [];
  let data: any[] = [];
  input.split(_options.lineSpator).forEach((line, lineNo) => {
    if (lineNo === 0) {
      headers = line.split(_options.dataSpatr);
    } else {
      data.push(
        line
          .split(_options.dataSpatr)
          .reduce((pre: Record<string, any>, cur, curIndex) => {
            pre[headers[curIndex]] = _options.parser[headers[curIndex]]
              ? _options.parser[headers[curIndex]](cur)
              : cur;
            return pre;
          }, {}),
      );
    }
  });

  return _options.ignoreHeader ? data : { data, headers };
}
