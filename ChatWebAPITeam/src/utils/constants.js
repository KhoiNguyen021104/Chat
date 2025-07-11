export const WHITELIST_DOMAINS = [
  'http://localhost:5173',
  'http://localhost:5174',
]


export const STATUS_FRIEND = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  BLOCKED: 'blocked'
}


export const TYPE_CONVERSATION = {
  PERSONAL: 'personal',
  GROUP: 'group'
}


export const TYPE_MESSAGE = {
  TEXT: 'text',
  DOCUMENT: 'document',
  MEDIA: 'media',
  LINK: 'link',
  EMOJI: 'emoji'
}


export const CLOUDINARY_FOLDER = {
  MESSAGE: {
    MEDIA: 'Chat-App/Message/Media',
    DOCUMENT: 'Chat-App/Message/Document',
  },
  AVATAR: {
    PERSONAL: 'Chat-App/Avatar/Personal',
    GROUP: 'Chat-App/Avatar/Group',
  }
}