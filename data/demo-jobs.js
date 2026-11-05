/* Hong Seh repair tracker: demo jobs (EV only). All data is invented for the concept.
   Times are relative to "now" when the demo is first seeded, so the demo always looks live.
   To connect a real system, replace HS_DEMO_JOBS / HSStore with calls to a jobs API that returns
   objects of the same shape.

   Job shape:
   code, jobType ('service' | 'accident'), customer, plate, model, odometer, serviceType, location,
   technician {name}, advisor {name, phone}, needsParts, stage (stage id), stageTimes {stageId: ISO},
   eta, etaUpdatedAt, battery {...}, dvi [{system, items:[{name, status, note, media}]}],
   quote [{id, kind, desc, qty, unit, hours, payer, status, original, reason}],
   parts [{name, status, eta, source}], chat [{from, text, at}], notifications [{channel, text, at}],
   payment {status, ref, paidAt}, checklist [bool], rating, claim {...}, history [...], warranty {...}, nextService */
window.HS_DEMO_JOBS = function () {
  const now = Date.now();
  const T = h => new Date(now + h * 3600e3).toISOString();
  // A clock time on a day relative to today, skipping Sundays (workshop closed)
  const D = (days, hour, min) => { const d = new Date(now); d.setDate(d.getDate() + days); if (d.getDay() === 0) d.setDate(d.getDate() + 1); d.setHours(hour, min || 0, 0, 0); return d.toISOString(); };

  return [
    /* ---------- Job 1: waiting for the customer's approval ---------- */
    {
      code: 'HS-4821', jobType: 'service',
      customer: 'Demo Logistics Pte Ltd', contact: 'Mr Tan',
      plate: 'SNB 4417 X', model: 'SRM T3EV', odometer: 60214,
      serviceType: '60,000 km scheduled service + brake warning light',
      location: 'Hong Seh workshop',
      technician: { name: 'Arif' }, advisor: { name: 'Wei Ling', phone: '+65 6xxx xxxx' },
      needsParts: true,
      stage: 'awaiting_approval',
      stageTimes: { checked_in: T(-26), inspection: T(-25.2), quote_sent: T(-21.6), awaiting_approval: T(-21.5) },
      eta: D(2, 16, 0), etaUpdatedAt: T(-21.5),
      battery: { soh: 94, cellDelta: '18 mV', chargePort: 'Pins clean, no heat marks', software: { from: 'V2.3.1', to: 'V2.4.0', status: 'Update available' } },
      dvi: [
        { system: 'High-voltage battery & cooling', items: [
          { name: 'Battery health (SOH)', status: 'ok', note: 'Battery holds 94% of its original capacity. The warranty guarantees at least 70%.', media: 'photo' },
          { name: 'Cell balance', status: 'ok', note: 'Largest gap between cells is 18 mV. Healthy.', media: null },
          { name: 'Battery coolant', status: 'monitor', note: 'Slightly below the max line. Topped up today; we will check it again next service.', media: 'photo' } ] },
        { system: 'Charging', items: [
          { name: 'DC fast-charge port (CCS2)', status: 'ok', note: 'Pins clean, no heat marks or corrosion.', media: 'photo' },
          { name: 'AC charge port (Type 2)', status: 'ok', note: 'Locks and charges normally.', media: null },
          { name: 'On-board charger', status: 'ok', note: 'Charged at its full 6.6 kW during the test.', media: null } ] },
        { system: 'Software', items: [
          { name: 'Vehicle control unit', status: 'monitor', note: 'Update V2.4.0 is available. It makes regenerative braking smoother. Included at no charge.', media: null },
          { name: 'Battery management system', status: 'ok', note: 'Already on the latest version.', media: null } ] },
        { system: 'Brakes', items: [
          { name: 'Brake booster pump', status: 'attention', note: 'The pump is noisy and slow to build pressure. This is what turned on your brake warning light. It needs replacing and is covered by warranty.', media: 'video' },
          { name: 'Brake fluid', status: 'attention', note: 'Fluid has absorbed 3% water. It needs a full flush, not just a top-up.', media: 'photo' },
          { name: 'Front brake pads', status: 'monitor', note: '4 mm left. Fine for roughly another 15,000 km.', media: 'photo' } ] },
        { system: 'Tyres, steering & suspension', items: [
          { name: 'Tyre tread', status: 'ok', note: '5 to 6 mm on all four tyres.', media: null },
          { name: 'Steering & suspension joints', status: 'ok', note: 'No play or leaks found.', media: null } ] },
        { system: 'Cabin & body', items: [
          { name: 'Front wiper blades', status: 'attention', note: 'Rubber is split and smears the windscreen in rain.', media: 'photo' },
          { name: 'Cabin air filter', status: 'attention', note: 'Clogged with dust, which weakens the air-con.', media: 'photo' },
          { name: 'Lights', status: 'ok', note: 'All working.', media: null } ] }
      ],
      quote: [
        { id: 'l1', kind: 'labour', desc: '60,000 km scheduled service', qty: 1, unit: 320, hours: 2, payer: 'You', status: 'approved', original: 320, reason: null },
        { id: 'l2', kind: 'part',   desc: 'Brake booster pump', qty: 1, unit: 0, hours: null, payer: 'Warranty', status: 'pending', original: null, reason: 'Fault found during inspection. Covered by vehicle warranty.' },
        { id: 'l3', kind: 'labour', desc: 'Fit brake booster pump', qty: 1, unit: 0, hours: 1.5, payer: 'Warranty', status: 'pending', original: null, reason: 'Covered by vehicle warranty.' },
        { id: 'l4', kind: 'part',   desc: 'Brake fluid flush, DOT 4 (1 L)', qty: 1, unit: 95, hours: 0.5, payer: 'You', status: 'pending', original: 60, reason: 'Original estimate was a top-up. Moisture test shows a full flush is needed.' },
        { id: 'l5', kind: 'part',   desc: 'Front wiper blades (pair)', qty: 1, unit: 48, hours: 0.2, payer: 'You', status: 'pending', original: null, reason: 'Added after inspection: blades are split.' },
        { id: 'l6', kind: 'part',   desc: 'Cabin air filter', qty: 1, unit: 65, hours: 0.3, payer: 'You', status: 'pending', original: null, reason: 'Added after inspection: filter is clogged.' },
        { id: 'l7', kind: 'labour', desc: 'Software update V2.4.0', qty: 1, unit: 0, hours: 0.5, payer: 'Hong Seh', status: 'pending', original: null, reason: 'Recommended update, no charge.' }
      ],
      parts: [
        { name: 'Brake booster pump', status: 'awaiting', eta: T(20), source: 'OEM regional hub (not in local stock)' },
        { name: 'Brake fluid DOT 4', status: 'awaiting', eta: null, source: 'Hong Seh stock' },
        { name: 'Front wiper blades', status: 'awaiting', eta: null, source: 'Hong Seh stock' },
        { name: 'Cabin air filter', status: 'awaiting', eta: null, source: 'Hong Seh stock' }
      ],
      chat: [
        { from: 'advisor', text: 'Hi Mr Tan, this is Wei Ling, your service advisor for job HS-4821. Your T3EV is checked in.', at: T(-26) },
        { from: 'advisor', text: 'Inspection is done. The brake booster pump caused the warning light and it is covered by warranty. A few small items need your OK in the quote. Photos are in the inspection report.', at: T(-21.5) }
      ],
      notifications: [
        { channel: 'WhatsApp', text: 'Hong Seh: your SRM T3EV (SNB 4417 X) is checked in. Track job HS-4821 with your tracking code.', at: T(-26) },
        { channel: 'SMS', text: 'Hong Seh: your SRM T3EV (SNB 4417 X) is checked in. Track job HS-4821 with your tracking code.', at: T(-26) },
        { channel: 'WhatsApp', text: 'Hong Seh: Arif has started the digital inspection of SNB 4417 X.', at: T(-25.2) },
        { channel: 'WhatsApp', text: 'Hong Seh: your inspection report and quote for SNB 4417 X are ready in your tracker.', at: T(-21.6) },
        { channel: 'Email', text: 'Hong Seh: your inspection report and quote for SNB 4417 X are ready in your tracker.', at: T(-21.6) },
        { channel: 'WhatsApp', text: 'Hong Seh: please approve or decline the quoted items for SNB 4417 X so we can continue.', at: T(-21.5) }
      ],
      payment: { status: 'unpaid', ref: null, paidAt: null },
      checklist: [false, false, false, false, false],
      rating: null, claim: null,
      history: [
        { date: T(-24 * 210), code: 'HS-3907', desc: '40,000 km scheduled service', cost: 320 },
        { date: T(-24 * 400), code: 'HS-3215', desc: 'Door seal replaced', cost: 0, note: 'Warranty' },
        { date: T(-24 * 440), code: 'HS-3102', desc: '20,000 km scheduled service', cost: 290 }
      ],
      warranty: { vehicle: '3 yrs / 100,000 km, until Mar 2027', battery: '8 yrs / 200,000 km, until Mar 2032' },
      nextService: '80,000 km or May 2027, whichever is first'
    },

    /* ---------- Job 2: accident claim, repair in progress ---------- */
    {
      code: 'HS-4790', jobType: 'accident',
      customer: 'Demo Logistics Pte Ltd', contact: 'Mr Tan',
      plate: 'YQ 2281 L', model: 'Farizon H9E 20ft', odometer: 31650,
      serviceType: 'Accident repair: front-left bumper, headlamp and radar bracket',
      location: 'Hong Seh workshop',
      technician: { name: 'Kumar' }, advisor: { name: 'Wei Ling', phone: '+65 6xxx xxxx' },
      needsParts: true,
      stage: 'repair',
      stageTimes: { checked_in: T(-24 * 6), inspection: T(-24 * 6 + 3), quote_sent: T(-24 * 5), awaiting_approval: T(-24 * 5 + 0.2), parts_ordered: T(-24 * 3), repair: T(-5) },
      eta: D(1, 15, 30), etaUpdatedAt: T(-5),
      battery: { soh: 98, cellDelta: '11 mV', chargePort: 'No impact damage', software: { from: 'H9-1.8', to: 'H9-1.8', status: 'Up to date' } },
      dvi: [
        { system: 'High-voltage safety after impact', items: [
          { name: 'High-voltage isolation test', status: 'ok', note: 'No leakage to the chassis. The battery was not affected by the impact.', media: 'photo' },
          { name: 'Battery health (SOH)', status: 'ok', note: '98% of original capacity.', media: null },
          { name: 'Battery mounting', status: 'ok', note: 'Mounts and underbody shield undamaged.', media: 'photo' } ] },
        { system: 'Charging', items: [
          { name: 'DC fast-charge port (CCS2)', status: 'ok', note: 'On the right side, away from the impact. Charges normally.', media: null } ] },
        { system: 'Software', items: [
          { name: 'Vehicle control unit', status: 'ok', note: 'Up to date. Crash event log saved for the insurer.', media: null } ] },
        { system: 'Body & safety', items: [
          { name: 'Front-left bumper', status: 'attention', note: 'Cracked through. Must be replaced.', media: 'photo' },
          { name: 'Front-left headlamp', status: 'attention', note: 'Lens and mounting tabs broken.', media: 'photo' },
          { name: 'Front radar bracket', status: 'attention', note: 'Bent. The collision-warning radar must be recalibrated after fitting.', media: 'video' },
          { name: 'Front-left wheel alignment', status: 'monitor', note: 'Slightly out. Will be aligned after the repair.', media: null } ] }
      ],
      quote: [
        { id: 'a1', kind: 'part',   desc: 'Front bumper assembly', qty: 1, unit: 1380, hours: null, payer: 'Insurer', status: 'approved', original: 1380, reason: null },
        { id: 'a2', kind: 'part',   desc: 'Front-left headlamp assembly', qty: 1, unit: 920, hours: null, payer: 'Insurer', status: 'approved', original: 920, reason: null },
        { id: 'a3', kind: 'part',   desc: 'Radar mounting bracket', qty: 1, unit: 210, hours: null, payer: 'Insurer', status: 'approved', original: 160, reason: 'Manufacturer price update after the insurer survey. Insurer approved the difference.' },
        { id: 'a4', kind: 'labour', desc: 'Body repair, fitting and paint', qty: 1, unit: 1450, hours: 11, payer: 'Insurer', status: 'approved', original: 1450, reason: null },
        { id: 'a5', kind: 'labour', desc: 'Radar recalibration and wheel alignment', qty: 1, unit: 280, hours: 1.5, payer: 'Insurer', status: 'approved', original: 280, reason: null },
        { id: 'a6', kind: 'labour', desc: 'Policy excess', qty: 1, unit: 500, hours: null, payer: 'You', status: 'approved', original: 500, reason: null }
      ],
      parts: [
        { name: 'Front bumper assembly', status: 'arrived', eta: T(-30), source: 'Farizon parts hub' },
        { name: 'Front-left headlamp assembly', status: 'arrived', eta: T(-28), source: 'Farizon parts hub' },
        { name: 'Radar mounting bracket', status: 'fitted', eta: T(-48), source: 'Hong Seh stock' }
      ],
      chat: [
        { from: 'advisor', text: 'Hi Mr Tan, the insurer has approved the claim. Parts have been ordered.', at: T(-24 * 3) },
        { from: 'customer', text: 'Thanks. Do you know roughly when it will be done?', at: T(-24 * 2) },
        { from: 'advisor', text: 'Bumper and headlamp both arrived today. Kumar starts the repair this morning, so we expect it ready by tomorrow afternoon.', at: T(-5) }
      ],
      notifications: [
        { channel: 'WhatsApp', text: 'Hong Seh: your Farizon H9E 20ft (YQ 2281 L) is checked in. Track job HS-4790 with your tracking code.', at: T(-24 * 6) },
        { channel: 'Email', text: 'Hong Seh: we have received your accident claim documents for YQ 2281 L.', at: T(-24 * 6) },
        { channel: 'WhatsApp', text: 'Hong Seh: your inspection report and quote for YQ 2281 L are ready in your tracker.', at: T(-24 * 5) },
        { channel: 'WhatsApp', text: 'Hong Seh: your insurer approved the claim for YQ 2281 L.', at: T(-24 * 3.1) },
        { channel: 'WhatsApp', text: 'Hong Seh: parts for YQ 2281 L are ordered.', at: T(-24 * 3) },
        { channel: 'WhatsApp', text: 'Hong Seh: repair work on YQ 2281 L has started.', at: T(-5) }
      ],
      payment: { status: 'unpaid', ref: null, paidAt: null },
      checklist: [false, false, false, false, false],
      rating: null,
      claim: {
        insurer: '[Insurer name]', ref: 'CLM-[reference]', surveyor: '[Surveyor name]',
        stage: 'repair',
        times: { docs: T(-24 * 6), assessment: T(-24 * 4.5), approval: T(-24 * 3.1), repair: T(-5) }
      },
      history: [
        { date: T(-24 * 150), code: 'HS-4012', desc: '20,000 km scheduled service', cost: 480 }
      ],
      warranty: { vehicle: '3 yrs / 100,000 km, until Jun 2027', battery: '8 yrs / 200,000 km, until Jun 2032' },
      nextService: '40,000 km or Jun 2026'
    },

    /* ---------- Job 3: ready for collection ---------- */
    {
      code: 'HS-4755', jobType: 'service',
      customer: 'Demo Logistics Pte Ltd', contact: 'Mr Tan',
      plate: 'SNC 2093 R', model: 'Farizon Super Van', odometer: 49980,
      serviceType: 'Battery health check, software update and tyre rotation',
      location: 'Hong Seh workshop',
      technician: { name: 'Jun Hao' }, advisor: { name: 'Wei Ling', phone: '+65 6xxx xxxx' },
      needsParts: false,
      stage: 'ready',
      stageTimes: { checked_in: T(-9), inspection: T(-8.5), quote_sent: T(-7), awaiting_approval: T(-6.9), repair: T(-6.2), qc: T(-2.5), ready: T(-1.2) },
      eta: T(-1.2), etaUpdatedAt: T(-1.2),
      battery: { soh: 97, cellDelta: '14 mV', chargePort: 'Clean, latch working', software: { from: 'SV-3.0.2', to: 'SV-3.1.0', status: 'Updated today' } },
      dvi: [
        { system: 'High-voltage battery & cooling', items: [
          { name: 'Battery health (SOH)', status: 'ok', note: '97% of original capacity.', media: 'photo' },
          { name: 'Battery coolant', status: 'ok', note: 'Level and condition good.', media: null } ] },
        { system: 'Charging', items: [
          { name: 'DC fast-charge port (CCS2)', status: 'ok', note: 'Clean, latch working.', media: null },
          { name: 'Charging cable', status: 'monitor', note: 'Outer sleeve scuffed near the plug. Safe to use; consider replacing within a year.', media: 'photo' } ] },
        { system: 'Software', items: [
          { name: 'Vehicle software', status: 'ok', note: 'Updated from SV-3.0.2 to SV-3.1.0. Range display is now more accurate.', media: null } ] },
        { system: 'Tyres', items: [
          { name: 'Tyre rotation', status: 'ok', note: 'Done. Fronts were wearing faster, so they moved to the rear.', media: null },
          { name: 'Tyre tread', status: 'ok', note: '4 to 5 mm all round.', media: 'photo' } ] }
      ],
      quote: [
        { id: 'r1', kind: 'labour', desc: 'Battery health check and report', qty: 1, unit: 120, hours: 1, payer: 'You', status: 'approved', original: 120, reason: null },
        { id: 'r2', kind: 'labour', desc: 'Software update SV-3.1.0', qty: 1, unit: 0, hours: 0.5, payer: 'Hong Seh', status: 'approved', original: 0, reason: null },
        { id: 'r3', kind: 'labour', desc: 'Tyre rotation and pressure check', qty: 1, unit: 60, hours: 0.5, payer: 'You', status: 'approved', original: 60, reason: null },
        { id: 'r4', kind: 'labour', desc: 'Wheel balancing (4 wheels)', qty: 1, unit: 80, hours: 0.7, payer: 'You', status: 'approved', original: null, reason: 'Added after inspection: vibration at 80 km/h. You approved it in the tracker.' }
      ],
      parts: [],
      chat: [
        { from: 'advisor', text: 'Hi Mr Tan, the Super Van is ready. Battery is at 97% health and the software is updated. You can pay in the tracker before you come.', at: T(-1.2) }
      ],
      notifications: [
        { channel: 'WhatsApp', text: 'Hong Seh: your Farizon Super Van (SNC 2093 R) is checked in. Track job HS-4755 with your tracking code.', at: T(-9) },
        { channel: 'WhatsApp', text: 'Hong Seh: your inspection report and quote for SNC 2093 R are ready in your tracker.', at: T(-7) },
        { channel: 'WhatsApp', text: 'Hong Seh: repair work on SNC 2093 R has started.', at: T(-6.2) },
        { channel: 'WhatsApp', text: 'Hong Seh: SNC 2093 R is ready for collection. Payment and job card are in your tracker.', at: T(-1.2) },
        { channel: 'SMS', text: 'Hong Seh: SNC 2093 R is ready for collection. Payment and job card are in your tracker.', at: T(-1.2) },
        { channel: 'Email', text: 'Hong Seh: SNC 2093 R is ready for collection. Payment and job card are in your tracker.', at: T(-1.2) }
      ],
      payment: { status: 'unpaid', ref: null, paidAt: null },
      checklist: [false, false, false, false, false],
      rating: null, claim: null,
      history: [
        { date: T(-24 * 180), code: 'HS-3990', desc: '25,000 km scheduled service', cost: 260 },
        { date: T(-24 * 300), code: 'HS-3544', desc: 'Pre-delivery inspection', cost: 0, note: 'Included' }
      ],
      warranty: { vehicle: '3 yrs / 100,000 km, until Jan 2028', battery: '8 yrs / 200,000 km, until Jan 2033' },
      nextService: '75,000 km or May 2027'
    }
  ];
};
