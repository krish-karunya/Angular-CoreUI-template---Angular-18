export enum MediaCueTypeEnum {
  ImageURL = 1,
  Image = 2,
  AudioURL = 3,
  Audio = 4,
  VideoURL = 5,
  Video = 6,
}

export interface MediaCueEditDialogData {
  newMediaCue: boolean;
  preventMediaTypeChange?: boolean;
  onlyUseSameMediaTypeCategory?: boolean;
  type: MediaCueTypeEnum;
  id?: number;
}

export interface IMediaProperties {
  thumbnailHeight: number;
  thumbnailWidth: number;
  previewMaxWidth?: number;
  previewMaxHeight?: number;
}
