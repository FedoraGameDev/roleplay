export const LANDING = "/";
export const SIGN_UP = "/signup";
export const SIGN_IN = "/signin";
export const HOME = "/home";
export const ACCOUNT = "/account";
export const ADMIN = "/admin";
export const PASSWORD_FORGET = "/pw-forget";

export const STORY_CONTAINER = "/story";
export const LIST_STORY = "/story/list";
export const LIST_STORY_PART = "/story/list/:start/:quantity";
export const LIST_GENRE = "/story/genre/list"
export const STORY_VIEW = "/story/view/:story_id";
export const CHAPTER_VIEW = "/story/chapter/view/:story_id/:chapter_name";
export const CREATE_POST = "/story/post/:story_id";
export const APPLY_CHARACTER = "/story/apply";
export const ACCEPT_CHARACTER = "/story/accept";
export const DENY_CHARACTER = "/story/deny";

export const CREATE_STORY = "/story/create";
export const UPDATE_STORY = "/story/update";
export const CREATE_CHAPTER = "/story/chapter/create";
export const UPDATE_CHAPTER = "/story/update/chapter";
export const CREATE_REPLY = "/story/chapter/post";
export const UPDATE_REPLY = "/story/update/chapter/post";

export const LIST_CHARACTERS = "/character/list";
export const VIEW_CHARACTER = "/character/view/:character_id";
export const CREATE_CHARACTER = "/character/create";
export const UPDATE_CHARACTER = "/character/update"

export const BACKEND = "http://simply-roleplay.herokuapp.com/api";