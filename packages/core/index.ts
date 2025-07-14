import components from "./components";
import { makeIntaller } from "@hyl-fake-element-plus/utils";
import "@hyl-fake-element-plus/theme"

const installer = makeIntaller(components)
export *  from "@hyl-fake-element-plus/components"
export default installer