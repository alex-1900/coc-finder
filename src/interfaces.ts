/**
 * text field
 */
export interface TextField {
  text: string;
}

/**
 * Rg result message for begin of a file.
 */
export interface RgMessageBegin {
  type: string;
  data: {
    path: TextField;
  };
}

export interface RgMessageSubmatch {
  start: number;
  end:   number;
  match: TextField;
}

/**
 * Rg result message for matched lines.
 */
export interface RgMessageMatch {
  type: string;
  data: {
    absolute_offset: number|null;
    line_number:     number;
    lines:           TextField;
    path:            TextField;
    submatches:      RgMessageSubmatch[];
  };
}

/**
 * Rg result message for end of a file.
 */
export interface RgMessageEnd {
  type: string;
  data: {
    binary_offset: number|null;
    path: TextField;
    stats: object;  // no need
  };
}
