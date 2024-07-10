import mainCommands from "./main.commands";
import lpCommands from "./lp.commands";
import stakingV1Commands from "./stakingV1.commands";
import stakingV2Commands from "./stakingV2.commands";
import stakingV3Commands from "./stakingV3.commands";

export default (_bot: any) => {
    mainCommands (_bot);
    lpCommands (_bot);
    stakingV1Commands (_bot);
    stakingV2Commands (_bot);
    stakingV3Commands (_bot);
}