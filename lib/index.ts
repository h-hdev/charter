import { Highcharter } from "./highcharts/Highcharter";

import { Charter } from "./Charter";
import HTMLCharter from "./HTMLCharter";
import Lefse from "./highcharts/Lefse";
import GenusTree from "./highcharts/GenusTree";
import Circos from "./highcharts/Circos";
import Network from "./highcharts/Network";
// regist charts
// Charter.register('line-basic', LineBasic);
Charter.register("highcharts", Highcharter);
Charter.register("html", HTMLCharter);
Charter.register("lefse", Lefse);
Charter.register("genus", GenusTree);
Charter.register("circos", Circos);
Charter.register("network", Network);

const Chart = Charter;
export { Chart };
