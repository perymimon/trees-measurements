import {Trees} from "/src/components/tree-fiver/Tree";
import '/src/myModification/controls.css'
import Grounds from "./Grounds";
import Markers from "../blocks/Marker";
import Rulers from "./Rulers";

export function Groves() {
    return (
        <>

            <Rulers/>
            <Markers/>
            <Grounds size={0.9}/>
            <Trees/>

        </>
    )
}

export default Groves;