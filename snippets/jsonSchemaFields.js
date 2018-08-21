const mongoose = require('mongoose')

// The custom form struture

module.exports = {
  blocks: [
    {
      _id: false,
      name: { type: String },
      fields: [{ type: String }]
    }
  ],
  properties: { type: mongoose.Schema.Types.Mixed },
  required: [{ type: String }]
}
