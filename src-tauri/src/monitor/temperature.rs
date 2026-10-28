use serde::Serialize;
use sysinfo::Components;

const CPU_LABEL_HINTS: [&str; 4] = ["cpu", "package", "tctl", "core"];

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TemperatureStats {
    cpu_celsius: Option<f32>,
    gpu_celsius: Option<f32>,
}

// On Windows sysinfo only reads ACPI thermal zones via WMI, which many boards don't expose
// (NotImplemented, even as admin), so `None` is normal.
pub fn read(components: &mut Components, gpu_celsius: Option<f32>) -> TemperatureStats {
    components.refresh(true);

    let readings: Vec<(String, f32)> = components
        .list()
        .iter()
        .filter_map(|component| Some((component.label().to_lowercase(), component.temperature()?)))
        .filter(|(_, celsius)| celsius.is_finite() && *celsius > 0.0)
        .collect();

    let hottest = |only_cpu: bool| {
        readings
            .iter()
            .filter(|(label, _)| !only_cpu || CPU_LABEL_HINTS.iter().any(|hint| label.contains(hint)))
            .map(|(_, celsius)| *celsius)
            .reduce(f32::max)
    };

    TemperatureStats {
        cpu_celsius: hottest(true).or_else(|| hottest(false)),
        gpu_celsius,
    }
}
