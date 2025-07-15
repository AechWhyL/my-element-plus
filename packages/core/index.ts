import components from "./components";
import { makeIntaller } from "@hyl-fake-element-plus/utils";
import {library} from "@fortawesome/fontawesome-svg-core"
import {fas} from "@fortawesome/free-solid-svg-icons"
import "@hyl-fake-element-plus/theme"

library.add(fas)

const installer = makeIntaller(components)
export *  from "@hyl-fake-element-plus/components"
export default installer