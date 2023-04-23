import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { Float32BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { Vector3 } from 'three/src/math/Vector3.js';

class WireframeGeometry extends BufferGeometry {

    constructor( geometry = null ) {

        super();

        this.type = 'WireframeGeometry';

        this.parameters = {
            geometry: geometry
        };
        console.log(geometry)

        if ( geometry !== null ) {

            // buffer

            const vertices = [];
            const edges = new Set();

            // helper variables

            const start = new Vector3();
            const end = new Vector3();

            if ( geometry.index !== null ) {
                console.log(geometry.index)

                // indexed BufferGeometry

                const position = geometry.attributes.position;
                const indices = geometry.index;
                let groups = geometry.groups;

                if ( groups.length === 0 ) {

                    groups = [ { start: 0, count: indices.count, materialIndex: 0 } ];

                }

                // create a data structure that contains all edges without duplicates

                for ( let o = 0, ol = groups.length; o < ol; ++ o ) {

                    const group = groups[ o ];

                    const groupStart = group.start;
                    const groupCount = group.count;

                    for ( let i = groupStart, l = ( groupStart + groupCount ); i < l; i += 3 ) {

                        for ( let j = 0; j < 3; j ++ ) {

                            const index1 = indices.getX( i + j );
                            const index2 = indices.getX( i + ( j + 1 ) % 3 );

                            start.fromBufferAttribute( position, index1 );
                            end.fromBufferAttribute( position, index2 );

                            if ( isUniqueEdge( start, end, edges ) === true ) {

                                vertices.push( start.x, start.y, start.z );
                                vertices.push( end.x, end.y, end.z );

                            }

                        }

                    }

                }

            } else {

                // non-indexed BufferGeometry

                const position = geometry.attributes.position;
                console.log('position', position)
                for ( let i = 0, l = ( position.count / 3 ); i < l; i ++ ) {

                    // if (i > 4) return

                    for ( let j = 0; j < 3; j ++ ) {

                        // const index1 = 4 * i + j;
                        // const index2 = 4 * i + ( ( j + 2 ) % 4 );

                        const index1 = 3 * i + j;
                        const index2 = 3 * i + ( ( j + 2 ) % 3 );

                        start.fromBufferAttribute( position, index1 );
                        end.fromBufferAttribute( position, index2 );

                        if ( isUniqueEdge( start, end, edges ) === true ) {
                            console.log(start.x, start.y, start.z)

                            // -1 1 1 => 1 1 -1
                            // 1 1 -1 => 1 1 -1 should be deleted

                            // -1 1 -1
                            // -1 1 1 should not be deleted

                            // |𝑥1−𝑥2|=|𝑦1−𝑦2|
                            if (
                                // Math.abs(start.x - end.x) === Math.abs(start.y - end.y) &&
                                // start.x !== start.x
                                start.x !== end.x &&
                                start.y === end.y &&
                                start.z === end.z
                            ) {
                                continue
                            }
                            vertices.push( start.x, start.y, start.z );
                            vertices.push( end.x, end.y, end.z );

                        }

                    }

                }

            }

            // build geometry

            this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

        }

    }

}

function isUniqueEdge( start, end, edges ) {

    const hash1 = `${start.x},${start.y},${start.z}-${end.x},${end.y},${end.z}`;
    const hash2 = `${end.x},${end.y},${end.z}-${start.x},${start.y},${start.z}`; // coincident edge

    if ( edges.has( hash1 ) === true && edges.has( hash2 ) === true ) {

        return false;

    } else {

        edges.add( hash1 );
        edges.add( hash2 );
        return true;

    }

}


export { WireframeGeometry };
