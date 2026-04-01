import React, {Suspense} from 'react'
import './App.css'
import './myModification/controls.css'

import {Canvas, useLoader} from '@react-three/fiber'
import {Environment} from '@react-three/drei'
import {RGBELoader} from 'three-stdlib'
import Groves from "./blocks/Groves";
import TableControl from "./blocks/TableControl";
import Header from "./blocks/Header";
import FocusControls from "./blocks/FocusControl";
import MiniMapSun from "./blocks/MiniMapSun";

// Kick off HDR load before the Canvas mounts — hits browser cache by the time
// Environment suspends and requests the same URL.
useLoader.preload(RGBELoader, '/hdri/rooitou_park_1k.hdr')

function App() {
    return (
        <Suspense fallback={"Loading ..."}>
            <div className="App">
                <Header/>
                <MiniMapSun/>
                <Canvas className="tree-field" frameloop="demand"
                        gl={{antialias: true}}
                        dpr={[1, 1.5]}
                        camera={{fov: 30, position: [30, 10, 30]}}
                        linear={true}>

                    {/* Solid sky color — visible on first frame, replaced by HDR once decoded */}
                    <color attach="background" args={['#a8c8e8']}/>
                    <FocusControls />
                    <Suspense fallback={null}>
                        <Environment files="/hdri/rooitou_park_1k.hdr" background={true}/>
                    </Suspense>
                    <ambientLight intensity={1}/>
                    <Groves/>
                </Canvas>
                <div className="grid-control">
                    <TableControl/>
                </div>
                <footer>
                    Infographic implementation by <a href="https://github.com/perymimon" target="_blank">Pery Mimon</a>
                    &nbsp;
                    for <a target="_blank" href="https://facebook.com/Ampple-Apple-Mapping-101508234895620/"> Ampple - Apple Mapping</a>
                </footer>
            </div>
        </Suspense>
    )
}


export default App
