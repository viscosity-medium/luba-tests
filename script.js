//text content
const textContent = {
    "opposition": "These are opposition media and journalists whose channels' structure is different from more pro-establishment channels: they don't have a bunch of satellites and don't repost each other often. They're both metaphorically and literally on the opposite side to pro-Kremlin channels.",
    "military": "There are quite a few channels which cover exclusively war in Ukraine. Previously most of them covered other military conflicts and crimes. There are  channels (\"СИЛОВИКИ\", \"СИГНАЛ\") as well as individuals calling themselves \"war correspondents\" (\"Рыбарь\", \"Сладков\"). Some contain mostly reposts, some post more unique content.",
    "oftCitedNews": "These channels are the biggest ones. Almost all are news providers and pretend to be unbiased, except from Kadyrov_95. This one belongs to Chechnya leader and has incredibly high number of subscribers.",
    "influencers": "Journalists, political activists, who write on different subjects. They are supposed to post their own opinion, but they might post messages paid for by pro-government agencies too. Their structure resembles nodal points with small satellites like \"Авиадиспетчер\" and \"Темы Главное Главмедиа\". There are far less oppositional influencers than pro-government.",
    "nodalPoint": "Channels which almost don't have unique content but which are accompanied by multiple channels serving them. Not only regular channels have a bunch of exclusive satellites, but also more prominent as \"МИД России\" (Russian Ministry of foreign affairs) and \"СОЛОВЬЁВ\" (one of the most famous and odious Russian propagandists).",
    "entertainment": "These channels used to be Vkontakte groups which continued to work in telegram since this social became popular. They post political jokes and memes from time to time and tend to be slightly critical to the government and the war in particular."
}

//DOM-elements
const divMain = document.querySelector('.parent-wrapper');
const graphicElement = document.querySelector(".img_main");
const modalLeft = document.querySelector(".modal_left");
const modalRight = document.querySelector(".modal_right");

const oppositionalChannels = document.querySelector(".btn_oppositional");
const entertainmentChannels = document.querySelector(".btn_entertainment");
const satelliteChannels = document.querySelector(".btn_satellite");
const blogChannels = document.querySelector(".btn_influencers");
const nonHandshakeChannels = document.querySelector(".btn_biggest");
const militaryChannels = document.querySelector(".btn_military");


//properties
const mapObjectOfHTMLButtons = new Map([
    [oppositionalChannels, {
        coordinates: {x: -925, y: -155}
    }],
    [entertainmentChannels, {
        coordinates: {x: -850, y: 70}
    }],
    [satelliteChannels, {
        coordinates: {x: -290, y: -440}
    }],
    [blogChannels, {
        coordinates: {x: -225, y: 530}
    }],
    [nonHandshakeChannels, {
        coordinates: {x: 10, y: 280}
    }],
    [militaryChannels, {
        coordinates: {x: 310, y: 45}
    }],
]);


// zoom in/out on the section
let scale = 1;
const scalePitch = 0.03;
const scaleMax =4;

//functions
const defineCoordinatesFunction = (e, zoomByClick, addParameter) => {
    let delta = e.delta || e.wheelDelta || zoomByClick;
    if (delta === undefined) {
        delta = e.originalEvent.detail;
    }
    delta = Math.max(-1,Math.min(1,delta)) // cap the delta to [-1,1] for cross browser consistency

    if(delta === -1){
        modalLeft.classList.add("closed_left"),
        modalRight.classList.add("closed_right"),
        modalLeft.classList.remove("opened_left"),
        modalRight.classList.remove("opened_right")
    }
    let offset = {x: divMain.scrollLeft, y: divMain.scrollTop};
    let image_loc = {
        x: e.pageX + offset.x + (addParameter ? addParameter.x : 0),
        y: e.pageY + offset.y + (addParameter ? addParameter.y : 0),
    };

    let zoom_point = {x: image_loc.x / scale, y: image_loc.y / scale};

    // apply zoom
    scale += delta*scalePitch * scale;
    scale = Math.max(1,Math.min(scaleMax,scale));

    let zoom_point_new = {x: zoom_point.x * scale, y: zoom_point.y * scale};

    let newScroll = {
        x: zoom_point_new.x - e.pageX,
        y: zoom_point_new.y - e.pageY
    };

    graphicElement.style.transform = `scale(${scale}, ${scale})`;
    divMain.scrollTop = newScroll.y;
    divMain.scrollLeft = newScroll.x;
};

const dragFunction = (e) => {
    if (e.buttons) {
        let dragX = 0;
        let dragY = 0;
        if (e.pageX - previousX !== 0) {
            dragX = previousX - e.pageX;
            previousX = e.pageX;
        }
        if (e.pageY - previousY !== 0) {
            dragY = previousY - e.pageY;
            previousY = e.pageY;
        }
        if (dragX !== 0 || dragY !== 0) {
            divMain.scrollBy(dragX, dragY);
        }
    } else if (e.touches) {
        let dragX = 0;
        let dragY = 0;
        if (e.touches[0].pageX - previousX !== 0) {
            dragX = previousX - e.touches[0].pageX;
            previousX = e.touches[0].pageX;
        }
        if (e.touches[0].pageY - previousY !== 0) {
            dragY = previousY - e.touches[0].pageY;
            previousY = e.touches[0].pageY;
        }
        if (dragX !== 0 || dragY !== 0) {
            divMain.scrollBy(dragX, dragY);
        }
    }
    return null
}

const zoomFunction = (e, addParameter, modalSide, textItem) => {
    let scaleFactor = graphicElement.style.transform.split(/\(|,/)[1] || 1;
    const zoomCoordinates = {
        x: e.clientX,
        y: e.clientY
    };
    setTimeout(()=>{
        modalSide === "left" ? (
            modalLeft.classList.remove("closed_left"),
            modalLeft.classList.add("opened_left"),
            modalLeft.querySelector(".modal-content").textContent = textContent[`${textItem}`]
        ) : (
            modalRight.classList.remove("closed_right"),
            modalRight.classList.add("opened_right"),
            modalRight.querySelector(".modal-content").textContent = textContent[`${textItem}`]
        )
    }, 400)
    if(Math.floor(+scaleFactor) !==  Math.floor(+scaleMax)){
        const interval = setInterval(()=>{
            scaleFactor = (Math.ceil(scaleFactor * 100) / 100) + scalePitch;
            graphicElement.style.transform = `scale(${scaleFactor},${scaleFactor})`;
            defineCoordinatesFunction(e, 1, addParameter);
            if(scaleFactor >= scaleMax){
                clearInterval(interval);
            }
        },10);
    }
    return null
}

const manageElementsDimensionalParameters = ( elements ) =>{
    elements.forEach(( properties, element )=>{

        const {
            coordinates
        } = properties;

        element.style.cssText = `
            transform: translate(
                ${ coordinates.x }%, 
                ${ coordinates.y }%
            );
            height: ${ element.offsetWidth }px
        `
    });
}

const defineModalParameters = (desktopCoordinates, tabletCoordinates, mobileCoordinates) => {
    let addParameter = {};
    if (window.innerWidth > 1500) {
        addParameter = desktopCoordinates;
    } else if (window.innerWidth <= 1500 && window.innerWidth > 550) {
        addParameter = tabletCoordinates;
    } else if(window.innerWidth <= 550) {
        addParameter = mobileCoordinates;
    }
    return addParameter
}

let previousX, previousY;
//event-listeners
graphicElement.addEventListener('mousedown', (e) => {
    previousX = e.pageX;
    previousY = e.pageY;
    graphicElement.style.cursor = 'grabbing';
});


graphicElement.addEventListener('mouseup', (e)=> {
    graphicElement.style.cursor = 'grab';
});

graphicElement.addEventListener('touchstart', (e) => {
    previousX = e.touches[0].clientX;
    previousY = e.touches[0].clientY;
    graphicElement.style.cursor = 'grabbing';
});

graphicElement.addEventListener('mousemove', (e)=>{
    dragFunction(e);
});

divMain.addEventListener('touchmove', (e) => {
    console.log(e);
    dragFunction(e);
});

divMain.addEventListener('wheel', (e) => {
    console.log(e)
    e.preventDefault();
    defineCoordinatesFunction(e, 1);
});

window.addEventListener('resize', () => {
    manageElementsDimensionalParameters(mapObjectOfHTMLButtons);
}, true)

oppositionalChannels.addEventListener('click', (e) => {
    const addParameter = defineModalParameters(
        {x: -4, y: 0},
        {x: -4, y: 0},
        {x: 0, y: 2}
    );
    zoomFunction(e, addParameter, "right", "opposition");
});
entertainmentChannels.addEventListener('click', (e) => {
    const addParameter = defineModalParameters(
        {x: -2, y: 0},
        {x: -4, y: 3},
        {x: 0, y: 2}
    );
    zoomFunction(e, addParameter, "right", "entertainment");
});
satelliteChannels.addEventListener('click', (e,) => {
    const addParameter = defineModalParameters(
        {x: 5, y: 0},
        {x: -2, y: 0},
        {x: 0, y: 1}
    );
    zoomFunction(e, addParameter, "right", "nodalPoint");
});
blogChannels.addEventListener('click', (e) => {
    const addParameter = defineModalParameters(
        {x: 2, y: 14},
        {x: -2, y: 16},
        {x: 0, y: 9}
    );
    zoomFunction(e, addParameter, "left", "influencers");
});
nonHandshakeChannels.addEventListener('click', (e) => {
    const addParameter = defineModalParameters(
        {x: 6, y: 10},
        {x: 1, y: 10},
        {x: 0, y: 6}
    );
    zoomFunction(e, addParameter, "left", "oftCitedNews");
});
militaryChannels.addEventListener('click', (e) => {
    const addParameter = defineModalParameters(
        {x: 12, y: 4},
        {x: 14, y: 4},
        {x: 3, y: 5}
    );
    zoomFunction(e, addParameter, "left", "military");
});

modalLeft.addEventListener('click', (e) => {
    modalLeft.classList.remove("opened_left"),
    modalLeft.classList.add("closed_left")
});

modalRight.addEventListener('click', (e) => {
    modalRight.classList.remove("opened_right"),
    modalRight.classList.add("closed_right")
});

manageElementsDimensionalParameters(mapObjectOfHTMLButtons)