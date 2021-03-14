type FileTypes = "video" | "audio" | "image" | "other"

type FileTransformType = {
  state: 'Move' | 'Insert' | 'Delete'
  position?: number // Position A
  fileObj?: FileWithMetadata
  type: FileTypes
  secondPosition?: number // Position B
}

export type FileWithMetadata = {
  file: string // Replaced file with string to make it easier
  customType: FileTypes
}

export class InputFilesType {
  video: FileWithMetadata[] | undefined = undefined;
  audio: FileWithMetadata[] | undefined = undefined;
  image: FileWithMetadata[] | undefined = undefined;
  other: FileWithMetadata[] | undefined = undefined;

  constructor(init: Partial<InputFilesType>) {
    Object.assign(this, init);
  }
}
function evaluateInsert(state:InputFilesType, op:FileTransformType): boolean {
    //console.log("Insert");
    if (op.type === 'image'){
      if (state.image !== undefined) state.image.push(op.fileObj)
      else state.image  = [op.fileObj]
    }
    else if (op.type === 'audio'){
      if (state.audio !== undefined) state.audio.push(op.fileObj)
      else state.audio  = [op.fileObj]
    }
    else if (op.type === 'video'){
      if (state.video !== undefined) state.video.push(op.fileObj)
      else state.video  = [op.fileObj]
    }
    else if (op.type === 'other'){
      if (state.other !== undefined) state.other.push(op.fileObj)
      else state.other  = [op.fileObj]
    }
    else return false
    return true
}
function evaluateDelete(state:InputFilesType, op:FileTransformType): boolean {
    //console.log("Delete");
    try {
      if (op.type === 'image') state.image.splice(op.position, 1);
      else if (op.type === 'audio') state.audio.splice(op.position, 1);
      else if (op.type === 'video') state.video.splice(op.position, 1);
      else if (op.type === 'other') state.other.splice(op.position, 1);
      else return false
    }catch (Error){
      console.log(Error.message);
      return false
    }
    return true
}
function evaluateMove(state:InputFilesType, op:FileTransformType): boolean {
    //console.log("Move");
    try {
      //// TODO: Add more robust validation after refactoring.
      /*if (op.position <-1) | (op.secondPosition > ) | (op.po){
        throw new RangeError();
      }*/
      if (op.type === 'image'){
        var temp = state.image[op.position];
        state.image[op.position] = state.image[op.secondPosition];
        state.image[op.secondPosition] = temp;
      }
      else if (op.type === 'audio'){
       var  temp = state.audio[op.position];
        state.audio[op.position] = state.audio[op.secondPosition];
        state.audio[op.secondPosition] = temp;
      }
      else if (op.type === 'video'){
        var temp = state.video[op.position];
        state.video[op.position] = state.video[op.secondPosition];
        state.video[op.secondPosition] = temp;
      }
      else if (op.type === 'other'){
        var temp = state.other[op.position];
        state.other[op.position] = state.other[op.secondPosition];
        state.other[op.secondPosition] = temp;
      }
      else return false
    }catch (Error){
      console.log(Error.message);
      return false
    }
    return true
}
function evaluate(state:InputFilesType, op:FileTransformType): boolean {
    if (op.state === 'Insert') return evaluateInsert(state, op)
    if (op.state === 'Delete') return evaluateDelete(state, op)
    if (op.state === 'Move') return evaluateMove(state, op)
    else return false
}

function match(state1:InputFilesType, state2: InputFilesType): boolean {
  if (JSON.stringify(state1.video) != JSON.stringify(state2.video)){
    return false
  }
  if (JSON.stringify(state1.audio) != JSON.stringify(state2.audio)){
    return false
  }
  if (JSON.stringify(state1.image) != JSON.stringify(state2.image)){
    return false
  }
  if (JSON.stringify(state1.other) != JSON.stringify(state2.other)){
    return false
  }
  return true
}

function isValid(
  stale,
  latest,
  transform
) {
  var initialState = new InputFilesType(stale);
  transform.forEach(element => {
    evaluate(stale,element);
    /*
    console.log("----------------");
    console.log(stale.video);
    console.log(stale.audio);
    console.log(stale.image);
    console.log(stale.other);
    console.log("++---------------");
    */
  });
  var finalState = new InputFilesType(latest);
  console.log(match(stale, finalState));
}

isValid(
  {
    video: [
      { file: '1.mp4', customType: 'video' },
      { file: '2.mp4', customType: 'video' },
      { file: '3.mp4', customType: 'video' }
    ]
  },
  {
    video: [
      { file: '2.mp4', customType: 'video' },
      { file: '1.mp4', customType: 'video' }
    ],
    image: [{ file: '1.png', customType: 'image' }]
  },
  [
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
  ]
) // true

isValid(
  {},
  {
    video: [
      { file: '1.mov', customType: 'video' },
      { file: '2.mov', customType: 'video' }
    ],
    image: [
      { file: '1.png', customType: 'image' },
      { file: '2.png', customType: 'image' },
      { file: '3.png', customType: 'image' }
    ]
  },
  [
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
  ]
) // false
/***
 * Three reasons why
 * Audio not there
 * Video not deleted
 * Images not moved
 */

isValid(
  {
    video: [
      { file: '1.mp4', customType: 'video' },
      { file: '2.mp4', customType: 'video' },
      { file: '3.mp4', customType: 'video' }
    ],
    image: [{ file: '1.png', customType: 'image' }]
  },
  {
    video: [
      { file: '3.mp4', customType: 'video' },
      { file: '1.mp4', customType: 'video' }
    ],
    image: [
      { file: '1.png', customType: 'image' },
      { file: '2.png', customType: 'image' }
    ]
  },
  [
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
  ]
) // false, wrong image deletion
