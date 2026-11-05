/* Hong Seh repair tracker: configuration.
   Stage names, durations, notification templates and status vocabularies live here,
   so they can be changed without touching the tracker code.
   Placeholders in templates: {code} {plate} {model} {tech} {advisor} {eta} {partsEta} */
window.HS_CONFIG = {
  storageKey: 'hs-tracker-v1',
  dataVersion: 4, // bump to force every browser to reseed the demo jobs

  // Main repair timeline ("pizza tracker"). hours = typical time spent in the stage, used for the ETA.
  stages: [
    { id: 'checked_in',        label: 'Checked in',            hours: 0.5, channels: ['WhatsApp', 'SMS'],
      notify: 'Hong Seh: your {model} ({plate}) is checked in. Track job {code} with your tracking code.' },
    { id: 'inspection',        label: 'Inspection',            hours: 2,   channels: ['WhatsApp'],
      notify: 'Hong Seh: {tech} has started the digital inspection of {plate}.' },
    { id: 'quote_sent',        label: 'Quote sent',            hours: 0.5, channels: ['WhatsApp', 'Email'],
      notify: 'Hong Seh: your inspection report and quote for {plate} are ready in your tracker.' },
    { id: 'awaiting_approval', label: 'Awaiting your approval', hours: 3,  channels: ['WhatsApp', 'SMS'],
      notify: 'Hong Seh: please approve or decline the quoted items for {plate} so we can continue.' },
    { id: 'parts_ordered',     label: 'Parts ordered',         hours: 20,  channels: ['WhatsApp'], optional: true,
      notify: 'Hong Seh: parts for {plate} are ordered. Expected arrival {partsEta}.' },
    { id: 'repair',            label: 'Repair in progress',    hours: 6,   channels: ['WhatsApp'],
      notify: 'Hong Seh: repair work on {plate} has started. Estimated completion {eta}.' },
    { id: 'qc',                label: 'Quality check',         hours: 2,   channels: ['WhatsApp'],
      notify: 'Hong Seh: repair done. Road test and battery scan on {plate} under way.' },
    { id: 'ready',             label: 'Ready for collection',  hours: 0,   channels: ['WhatsApp', 'SMS', 'Email'],
      notify: 'Hong Seh: {plate} is ready for collection. Payment and job card are in your tracker.' },
    { id: 'collected',         label: 'Collected',             hours: 0,   channels: ['WhatsApp', 'Email'],
      notify: 'Hong Seh: thank you for collecting {plate}. Tell us how we did in your tracker.' }
  ],

  // Accident claim sub-tracker
  claimStages: [
    { id: 'docs',       label: 'Documents received' },
    { id: 'assessment', label: 'Insurer assessment' },
    { id: 'approval',   label: 'Approval' },
    { id: 'repair',     label: 'Repair' },
    { id: 'settlement', label: 'Settlement' }
  ],

  // Digital vehicle inspection status. Each has an icon AND a word, so colour is never the only signal.
  dviStatus: {
    ok:        { label: 'OK',              icon: '✓', cls: 'ok' },
    monitor:   { label: 'Monitor',         icon: '!', cls: 'mon' },
    attention: { label: 'Needs attention', icon: '✕', cls: 'att' }
  },

  partStatus: {
    awaiting: { label: 'Awaiting your approval', step: 0 },
    ordered:  { label: 'Ordered',                step: 1 },
    arrived:  { label: 'Arrived',                step: 2 },
    fitted:   { label: 'Fitted',                 step: 3 }
  },

  lineStatus: {
    pending:  { label: 'Waiting for you' },
    approved: { label: 'Approved' },
    declined: { label: 'Declined' },
    question: { label: 'Question asked' }
  },

  quickReplies: ['Any update?', 'Can I add another service?', 'When will it be ready?', 'Can you deliver it to my depot?'],

  pickupChecklist: [
    'Keys and charging cable returned',
    'Battery charged to at least 80%',
    'Work done explained by the advisor',
    'Replaced parts shown or returned',
    'Job card and invoice received'
  ],

  gstRate: 0.09
};
