"use strict";
exports.__esModule = true;
exports.InputFilesType = void 0;
var InputFilesType = /** @class */ (function () {
    function InputFilesType(init) {
        this.video = undefined;
        this.audio = undefined;
        this.image = undefined;
        this.other = undefined;
        Object.assign(this, init);
    }
    return InputFilesType;
}());
exports.InputFilesType = InputFilesType;
function evaluateInsert(state, op) {
    console.log("Insert");
    if (op.type === 'image')
        state.image.push(op.fileObj);
    else if (op.type === 'audio')
        state.audio.push(op.fileObj);
    else if (op.type === 'video')
        state.video.push(op.fileObj);
    else if (op.type === 'other')
        state.other.push(op.fileObj);
    else
        return false;
    return true;
}
function evaluateDelete(state, op) {
    console.log("Delete");
    return true;
}
function evaluateMove(state, op) {
    console.log("Move");
    return true;
}
function evaluate(state, op) {
    if (op.state === 'Insert')
        return evaluateInsert(state, op);
    if (op.state === 'Delete')
        return evaluateDelete(state, op);
    if (op.state === 'Move')
        return evaluateMove(state, op);
    else
        return false;
}
function isValid(stale, latest, transform) {
    initialState: new InputFilesType(stale);
    transform.forEach(function (element) {
        //  evaluate(stale,element);
        /*console.log(stale.video.toString());
        console.log(stale.audio.toString());
        console.log(stale.image.toString());
        console.log(stale.other.toString());*/
    });
}
isValid({
    video: [
        { file: '1.mp4', customType: 'video' },
        { file: '2.mp4', customType: 'video' },
        { file: '3.mp4', customType: 'video' }
    ]
}, {
    video: [
        { file: '2.mp4', customType: 'video' },
        { file: '1.mp4', customType: 'video' }
    ],
    image: [{ file: '1.png', customType: 'image' }]
}, [
    { state: 'Move', position: 0, secondPosition: 2, type: 'video' },
    {
        state: 'Insert',
        fileObj: { file: '1.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Delete',
        position: 0,
        type: 'video'
    }
]); // true
isValid({}, {
    video: [
        { file: '1.mov', customType: 'video' },
        { file: '2.mov', customType: 'video' }
    ],
    image: [
        { file: '1.png', customType: 'image' },
        { file: '2.png', customType: 'image' },
        { file: '3.png', customType: 'image' }
    ]
}, [
    {
        state: 'Insert',
        fileObj: { file: '1.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Insert',
        fileObj: { file: '1.mp3', customType: 'audio' },
        type: 'audio'
    },
    {
        state: 'Insert',
        fileObj: { file: '1.mov', customType: 'video' },
        type: 'video'
    },
    {
        state: 'Delete',
        position: 0,
        type: 'video'
    },
    {
        state: 'Insert',
        fileObj: { file: '2.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Insert',
        fileObj: { file: '3.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Insert',
        fileObj: { file: '2.mov', customType: 'video' },
        type: 'video'
    },
    {
        state: 'Move',
        position: 2,
        secondPosition: 1,
        type: 'video'
    }
]); // false
/***
 * Three reasons why
 * Audio not there
 * Video not deleted
 * Images not moved
 */
isValid({
    video: [
        { file: '1.mp4', customType: 'video' },
        { file: '2.mp4', customType: 'video' },
        { file: '3.mp4', customType: 'video' }
    ],
    image: [{ file: '1.png', customType: 'image' }]
}, {
    video: [
        { file: '3.mp4', customType: 'video' },
        { file: '1.mp4', customType: 'video' }
    ],
    image: [
        { file: '1.png', customType: 'image' },
        { file: '2.png', customType: 'image' }
    ]
}, [
    { state: 'Move', position: 0, secondPosition: 2, type: 'video' },
    {
        state: 'Insert',
        fileObj: { file: '2.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Delete',
        position: 1,
        type: 'video'
    },
    {
        state: 'Insert',
        fileObj: { file: '3.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Delete',
        position: 1,
        type: 'image'
    }
]); // false, wrong image deletion
