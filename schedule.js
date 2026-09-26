(() => {
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

  const state = {
    raw: null,
    current: null,
    loadedFileName: null
  };

  const getTrack = (schedule, trackNo) => schedule?.tracks?.find((track) => Number(track.trackNo) === Number(trackNo));

  const validate = (value, { stationId, trackNumbers, vehicleNames }) => {
    const errors = [];
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { errors: ["JSONの先頭はオブジェクトである必要があります。"] };
    }
    if (value.schemaVersion !== 1 || value.kind !== "train-board-schedule") {
      errors.push("schemaVersion: 1 と kind: train-board-schedule を指定してください。");
    }
    if (String(value.stationId) !== String(stationId)) {
      errors.push(`この時刻表の駅ID（${value.stationId || "未指定"}）は、現在の駅ID（${stationId}）と一致しません。`);
    }
    if (!Array.isArray(value.tracks)) {
      errors.push("tracks は配列で指定してください。");
      return { errors };
    }

    const trackIds = new Set();
    const eventIds = new Set();
    value.tracks.forEach((track) => {
      const trackNo = Number(track?.trackNo);
      if (!Number.isInteger(trackNo) || !trackNumbers.includes(trackNo)) {
        errors.push(`存在しない番線です: ${track?.trackNo ?? "未指定"}`);
      } else if (trackIds.has(trackNo)) {
        errors.push(`${trackNo}番線が重複しています。`);
      }
      trackIds.add(trackNo);
      if (!Array.isArray(track?.events)) {
        errors.push(`${trackNo || "不明"}番線の events は配列で指定してください。`);
        return;
      }
      track.events.forEach((event, index) => {
        const prefix = `${trackNo || "不明"}番線の予定${index + 1}`;
        if (!event?.id || typeof event.id !== "string") errors.push(`${prefix}の id がありません。`);
        if (event?.id && eventIds.has(event.id)) errors.push(`予定IDが重複しています: ${event.id}`);
        if (event?.id) eventIds.add(event.id);
        if (!TIME_PATTERN.test(event?.time || "")) errors.push(`${prefix}の time は HH:MM 形式で指定してください。`);
        if (event?.vehicle && !vehicleNames.includes(event.vehicle)) {
          errors.push(`${prefix}の車両「${event.vehicle}」は vehicle_catalog.json にありません。`);
        }
      });
    });
    return { errors };
  };

  const sortEvents = (events) => [...events].sort((a, b) => a.time.localeCompare(b.time) || a.id.localeCompare(b.id));

  const getNextEvent = (trackNo, now) => {
    const track = getTrack(state.current, trackNo);
    if (!track) return null;
    return sortEvents(track.events).find((event) => event.time >= now) || null;
  };

  const load = (document, context, fileName = "") => {
    const result = validate(document, context);
    if (result.errors.length) return result;
    state.raw = clone(document);
    state.current = clone(document);
    state.loadedFileName = fileName;
    return { errors: [] };
  };

  const reset = () => {
    if (!state.raw) return false;
    state.current = clone(state.raw);
    return true;
  };

  const updateEventTime = (trackNo, eventId, time) => {
    if (!state.current || !TIME_PATTERN.test(time || "")) return false;
    const event = getTrack(state.current, trackNo)?.events.find((item) => item.id === eventId);
    if (!event) return false;
    event.time = time;
    return true;
  };

  const addEvent = (trackNo, time) => {
    if (!state.current || !TIME_PATTERN.test(time || "")) return null;
    const track = getTrack(state.current, trackNo);
    if (!track) return null;
    const event = { id: `manual-${trackNo}-${Date.now()}`, time };
    track.events.push(event);
    return event;
  };

  window.ScheduleStore = { state, validate, load, reset, getNextEvent, updateEventTime, addEvent };
})();
