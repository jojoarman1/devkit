use nvml_wrapper::{enum_wrappers::device::TemperatureSensor, Nvml};

// NVML (nvml.dll) ships with the NVIDIA driver and is loaded at runtime, so GPU temperature needs neither
// a kernel driver nor admin rights. Without an NVIDIA GPU, init fails and readings are None.
pub struct GpuMonitor {
    nvml: Option<Nvml>,
}

impl GpuMonitor {
    pub fn new() -> Self {
        Self { nvml: Nvml::init().ok() }
    }

    pub fn temperature(&self) -> Option<f32> {
        let device = self.nvml.as_ref()?.device_by_index(0).ok()?;
        device.temperature(TemperatureSensor::Gpu).ok().map(|celsius| celsius as f32)
    }
}
