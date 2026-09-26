# 時刻表JSON仕様（第1版）

時刻表は外部から読み込むデータです。車両の画像・種別画像・備考本文は含めず、`vehicle_catalog.json` に登録済みの車両名だけを参照します。

```json
{
  "schemaVersion": 1,
  "kind": "train-board-schedule",
  "stationId": "01",
  "tracks": [
    {
      "trackNo": 1,
      "events": [
        { "id": "1-1015", "time": "10:15", "vehicle": "E233系3000" }
      ],
      "noSchedule": { "message": "予定なし" }
    }
  ]
}
```

- `stationId`: `station_types.json` の駅ID。現在は `01`（渋谷南改札型）。
- `trackNo`: 番線番号。
- `id`: 時刻表内で重複しない予定ID。
- `time`: `HH:MM` 形式の発車時刻。
- `vehicle`: 任意。`vehicle_catalog.json` の `vehicle` 名を指定すると、その予定へ繰り上がった時点で車両表示も更新される。省略時は画面で選択中の車両表示を維持する。
- `noSchedule.message`: その番線に次の予定がないときの表示。省略時は「予定なし」。

読み込んだ原本は `raw`、画面で時刻を変更した内容は `current` として別々に保持します。「rawへ戻す」は原本から `current` を再作成します。書き出されるのは編集後の `current` です。
