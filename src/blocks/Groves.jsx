import {Suspense} from "react";
import {Trees} from "/src/components/tree-fiver/Tree";
import '/src/myModification/controls.css'
import Grounds from "./Grounds";
import Markers from "../blocks/Marker";
import Rulers from "./Rulers";

export function Groves() {
    return (
        <>
            {/* Grounds and Markers have no async deps — render on first frame */}
            <Grounds size={0.9}/>
            <Markers/>
            {/* Rulers suspend on troika font load */}
            <Suspense fallback={null}><Rulers/></Suspense>
            {/* Trees suspend on GLB load */}
            <Suspense fallback={null}><Trees/></Suspense>
        </>
    )
}

export default Groves;