import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import Konva from 'konva';
import * as Color from 'color';

UIkit.use(Icons);

const canvasWidth = 1920;
const canvasHeight = 960;

const colors = {
    blocked: Color.rgb(249, 215, 117),
    booked: Color.rgb(73, 100, 192),
    free: Color.rgb(65, 185, 149),
}

const colorDefaultOpacity = 0.5;
const colorHoverOpacity = 1.0;

interface Floor {
    id: number;
    image: string;
    desks: Desk[];
}

interface Desk {
    id: number;
    name: string;
    width: number;
    height: number;
    pos_x: number;
    pos_y: number;
    orientation: number;
    url?: string;
    blocked?: boolean;
    booked?: string;
}

function getDeskColor(desk: Desk, hover?: boolean): string {
    let col = colors.free;
    if (desk.blocked) {
        col = colors.blocked;
    } else if (desk.booked) {
        col = colors.booked;
    }
    return col.alpha(hover ? colorHoverOpacity : colorDefaultOpacity).hexa();
}

export function initMap(mapContainerId: string, floor: Floor, editMode: boolean) {
    const stage = new Konva.Stage({
        container: mapContainerId,
        width: canvasWidth,
        height: canvasHeight,
        draggable: true,
        scaleX: 1,
        scaleY: 1,
    });

    const floorLayer = new Konva.Layer();
    const deskLayer = new Konva.Layer();
    const labelLayer = new Konva.Layer();

    Konva.Image.fromURL(floor.image, function (imageNode: Konva.Image) {
        imageNode.setAttrs({
            x: 0,
            y: 0,
        });

        const imageWidth = imageNode.attrs.image.width;
        const imageHeight = imageNode.attrs.image.height;

        const zoom = Math.min(stage.width() / imageWidth, stage.height() / imageHeight);

        stage.scaleX(zoom);
        stage.scaleY(zoom);

        stage.offsetX(-(stage.width() * 0.5 - imageWidth * zoom * 0.5) / zoom);
        stage.offsetY(-(stage.height() * 0.5 - imageHeight * zoom * 0.5) / zoom);

        floorLayer.add(imageNode);
    });

    floor.desks.forEach(function (desk) {
        const deskRect = new Konva.Rect({
            x: desk.pos_x,
            y: desk.pos_y,
            width: desk.width,
            height: desk.height,
            fill: getDeskColor(desk),
            rotation: desk.orientation,
            draggable: editMode,
        });

        const deskLabel = new Konva.Text({
            x: desk.pos_x,
            y: desk.pos_y,
            width: desk.width,
            height: desk.height,
            fontSize: 14,
            align: 'center',
            verticalAlign: 'middle',
            fill: 'black',
            rotation: desk.orientation,
            text: desk.name + '\n\n' + (desk.blocked ? 'NICHT VERFÜGBAR' : (desk.booked ? desk.booked : 'FREI')),
            listening: false,
        });

        deskRect.on('mouseover', function () {
            deskRect.fill(getDeskColor(desk, true));
            if (editMode) {
                stage.container().style.cursor = 'grab';
            } else {
                stage.container().style.cursor = 'pointer';
            }
        });
        deskRect.on('mouseout', function () {
            deskRect.fill(getDeskColor(desk));
            stage.container().style.cursor = 'default';
        });
        deskRect.on('click tap', function () {
            if (desk.url != null) {
                window.location.href = desk.url;
            }
        });
        deskRect.on('dragstart', function () {
            stage.container().style.cursor = 'grabbing';
        });
        deskRect.on('dragend', function () {
            stage.container().style.cursor = 'grab';
            deskLabel.x(deskRect.x());
            deskLabel.y(deskRect.y());

            const posXElem = document.getElementById(desk.id + '.pos_x') as HTMLInputElement;
            if (posXElem != null) {
                posXElem.value = deskRect.x().toString();
            }

            const posYElem = document.getElementById(desk.id + '.pos_y') as HTMLInputElement;
            if (posYElem != null) {
                posYElem.value = deskRect.y().toString();
            }
        });
        deskRect.on('transformend', function () {
            const widthElem = document.getElementById(desk.id + '.width') as HTMLInputElement;
            if (widthElem != null) {
                widthElem.value = (desk.width * deskRect.scaleX()).toString();
            }

            const heightElem = document.getElementById(desk.id + '.height') as HTMLInputElement;
            if (heightElem != null) {
                heightElem.value = (desk.height * deskRect.scaleY()).toString();
            }

            const orientationElem = document.getElementById(desk.id + '.orientation') as HTMLInputElement;
            if (orientationElem != null) {
                orientationElem.value = deskRect.rotation().toString();
            }
        });

        if (editMode) {
            const deskTransformer = new Konva.Transformer();
            deskLayer.add(deskTransformer);
            deskTransformer.nodes([deskRect]);
        }

        deskLayer.add(deskRect);
        labelLayer.add(deskLabel);
    })

    stage.add(floorLayer);
    stage.add(deskLayer);
    stage.add(labelLayer);

    floorLayer.draw();
    deskLayer.draw();
    labelLayer.draw();

    const scaleBy = 1.05;
    stage.on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? -1 : 1;

        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({x: newScale, y: newScale});

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
    });

    function fitStageIntoParentContainer() {
        const container = document.getElementById(mapContainerId);

        const containerWidth = container.offsetWidth;

        const scale = containerWidth / canvasWidth;

        stage.width(canvasWidth * scale);
        stage.height(canvasHeight * scale);
        stage.scale({x: scale, y: scale});
    }

    fitStageIntoParentContainer();

    window.addEventListener('resize', fitStageIntoParentContainer);
}