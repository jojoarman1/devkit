use std::time::Duration;

use serde::Serialize;
use sysinfo::Networks;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NetworkStats {
    received_bytes_per_second: u64,
    transmitted_bytes_per_second: u64,
}

pub fn read(networks: &mut Networks, elapsed: Duration) -> NetworkStats {
    networks.refresh(true);

    let (received, transmitted) = networks
        .list()
        .iter()
        .filter(|(name, _)| !name.to_lowercase().contains("loopback"))
        .fold((0, 0), |(received, transmitted), (_, data)| {
            (received + data.received(), transmitted + data.transmitted())
        });

    // received()/transmitted() are deltas since the previous refresh, not rates
    let seconds = elapsed.as_secs_f64().max(f64::EPSILON);
    NetworkStats {
        received_bytes_per_second: (received as f64 / seconds) as u64,
        transmitted_bytes_per_second: (transmitted as f64 / seconds) as u64,
    }
}
