/**
 * Preset PC Builds — 12 Curated Configurations
 * 
 * Categories:
 *   - Gaming:       $800 / $1,500 / $3,000
 *   - Streaming:    $800 / $1,500 / $3,000
 *   - Productivity: $800 / $1,500 / $3,000
 *   - Workstation:  $2,000 / $4,000 / $8,000  (server-grade parts)
 */

export const useCases = [
    { id: 'gaming', label: 'Gaming', icon: '🎮', description: 'Max FPS & visual fidelity' },
    { id: 'streaming', label: 'Streaming', icon: '📡', description: 'Game + stream without drops' },
    { id: 'productivity', label: 'Productivity', icon: '🧠', description: 'Multitasking, editing & dev work' },
    { id: 'workstation', label: 'Workstation', icon: '🖥️', description: 'Server-grade builds for heavy workloads' },
];

export const presetBuilds = [

    // ─── GAMING ───────────────────────────────────────────

    {
        id: 'gaming-800',
        budget: 800,
        useCase: 'gaming',
        tier: 'Entry',
        name: 'Starter Frag',
        description: 'Solid 1080p gaming across all major titles',
        parts: {
            cpu: { name: 'AMD Ryzen 5 7500F', price: 155 },
            gpu: { name: 'NVIDIA RTX 5060', price: 389 },
            motherboard: { name: 'Gigabyte B650M DS3H', price: 110 },
            memory: { name: '16GB DDR5-5600 (2x8GB)', price: 149 },
            storage: { name: '500GB NVMe SSD (Gen4)', price: 75 },
            psu: { name: '550W 80+ Bronze', price: 50 },
            case: { name: 'Thermaltake S100 TG', price: 65 },
            cooler: { name: 'AMD Wraith Stealth (included)', price: 0 },
        },
    },
    {
        id: 'gaming-1500',
        budget: 1500,
        useCase: 'gaming',
        tier: 'Mid-Range',
        name: 'High-FPS Rig',
        description: 'High-FPS 1440p gaming with room to push settings',
        parts: {
            cpu: { name: 'AMD Ryzen 7 7700X', price: 295 },
            gpu: { name: 'NVIDIA RTX 5070', price: 549 },
            motherboard: { name: 'MSI MAG B650 Tomahawk WiFi', price: 190 },
            memory: { name: '32GB DDR5-6000 (2x16GB)', price: 95 },
            storage: { name: '1TB NVMe SSD (Gen4)', price: 75 },
            psu: { name: '750W 80+ Gold', price: 95 },
            case: { name: 'Fractal Design North', price: 130 },
            cooler: { name: 'Thermalright Peerless Assassin 120 SE', price: 38 },
        },
    },
    {
        id: 'gaming-3000',
        budget: 3000,
        useCase: 'gaming',
        tier: 'Enthusiast',
        name: '4K Dominator',
        description: 'No-compromise 4K gaming at max settings',
        parts: {
            cpu: { name: 'AMD Ryzen 9850x3d', price: 499 },
            gpu: { name: 'NVIDIA RTX 5080', price: 999 },
            motherboard: { name: 'Gigabyte X870E Aorus Elite WIFI7 Motherboard', price: 219 },
            memory: { name: '32GB DDR5-6400 (2x16GB)', price: 280 },
            storage: { name: '2TB NVMe SSD (Gen4)', price: 230 },
            psu: { name: '1000W 80+ Gold', price: 165 },
            case: { name: 'Lian Li O11 Dynamic EVO', price: 170 },
            cooler: { name: 'Arctic Liquid Freezer II 360', price: 130 },
        },
    },

    // ─── STREAMING ────────────────────────────────────────

    {
        id: 'streaming-800',
        budget: 800,
        useCase: 'streaming',
        tier: 'Entry',
        name: 'Stream Starter',
        description: '1080p gaming + 720p streaming via NVENC',
        parts: {
            cpu: { name: 'AMD Ryzen 5 7500F', price: 140 },
            gpu: { name: 'ASRock Intel Arc B570 Challenger 10GB OC GDDR6', price: 240 },
            motherboard: { name: 'ASRock B650M PG Riptide', price: 110 },
            memory: { name: '16GB DDR5-5600 (2x8GB)', price: 120 },
            storage: { name: '500 gb NVMe SSD (Gen4)', price: 60 },
            psu: { name: '600W 80+ Bronze', price: 55 },
            case: { name: 'Deepcool CH360', price: 65 },
            cooler: { name: 'ID-Cooling SE-214-XT', price: 20 },
        },
    },
    {
        id: 'streaming-1500',
        budget: 1500,
        useCase: 'streaming',
        tier: 'Mid-Range',
        name: 'Dual-Duty Machine',
        description: '1440p gaming + 1080p60 stream simultaneously',
        parts: {
            cpu: { name: 'AMD Ryzen 7 7700X', price: 249 },
            gpu: { name: 'NVIDIA RTX 5070 (NVENC)', price: 549 },
            motherboard: { name: 'MSI MAG B650 Tomahawk WiFi', price: 190 },
            memory: { name: '32GB DDR5-6000 (2x16GB)', price: 280 },
            storage: { name: '500 gb NVMe SSD (Gen4)', price: 60 },
            psu: { name: '750W 80+ Gold', price: 95 },
            case: { name: 'NZXT H7 Flow', price: 120 },
            cooler: { name: 'Thermalright Peerless Assassin 120 SE', price: 38 },
        },
    },
    {
        id: 'streaming-3000',
        budget: 3000,
        useCase: 'streaming',
        tier: 'Enthusiast',
        name: 'Pro Broadcast',
        description: '4K gaming + multi-bitrate streaming without breaking a sweat',
        parts: {
            cpu: { name: 'AMD Ryzen 9950x', price: 499 },
            gpu: { name: 'NVIDIA RTX 5080 (NVENC)', price: 999 },
            motherboard: { name: 'MSI MEG Z790 ACE', price: 390 },
            memory: { name: '64GB DDR5-6000 (2x32GB)', price: 400 },
            storage: { name: '2TB NVMe SSD (Gen5)', price: 220 },
            psu: { name: '1000W 80+ Gold', price: 165 },
            case: { name: 'Lian Li O11 Dynamic EVO', price: 170 },
            cooler: { name: 'NZXT Kraken X73', price: 180 },
        },
    },

    // ─── PRODUCTIVITY ─────────────────────────────────────

    {
        id: 'productivity-800',
        budget: 800,
        useCase: 'productivity',
        tier: 'Entry',
        name: 'Daily Driver',
        description: 'Fast multitasking, dev work & light photo editing',
        parts: {
            cpu: { name: 'AMD Ryzen 7 7700x', price: 249 },
            gpu: { name: 'AMD Radeon (integrated)', price: 0 },
            motherboard: { name: 'Gigabyte B650M DS3H', price: 110 },
            memory: { name: '32GB DDR5-5200 (2x16GB)', price: 280 },
            storage: { name: '500 gb NVMe SSD (Gen4)', price: 60 },
            psu: { name: '500W 80+ Bronze', price: 45 },
            case: { name: 'Fractal Design Pop Mini', price: 85 },
            cooler: { name: 'Thermalright Assassin X 120', price: 22 },
        },
    },
    {
        id: 'productivity-1500',
        budget: 1500,
        useCase: 'productivity',
        tier: 'Mid-Range',
        name: 'Power User',
        description: 'Video editing, large datasets & heavy browser workloads',
        parts: {
            cpu: { name: 'AMD Ryzen 9 7900X', price: 395 },
            gpu: { name: 'NVIDIA RTX 4060', price: 299 },
            motherboard: { name: 'ASUS TUF Gaming B650-Plus WiFi', price: 200 },
            memory: { name: '32GB DDR5-5600 (2x32GB)', price: 280 },
            storage: { name: '1TB NVMe SSD (Gen4)', price: 130 },
            psu: { name: '750W 80+ Gold', price: 95 },
            case: { name: 'be quiet! Pure Base 500DX', price: 110 },
            cooler: { name: 'Thermalright Assassin X 120', price: 22 },
        },
    },
    {
        id: 'productivity-3000',
        budget: 3000,
        useCase: 'productivity',
        tier: 'Enthusiast',
        name: 'Creative Studio',
        description: '3D rendering, 4K video timelines & AI/ML experimentation',
        parts: {
            cpu: { name: 'AMD Ryzen 9 9950X', price: 499 },
            gpu: { name: 'NVIDIA RTX 5080', price: 999 },
            motherboard: { name: 'Gigabyte X670E AORUS Master', price: 290 },
            memory: { name: '64GB DDR5-5600 (4x32GB)', price: 320 },
            storage: { name: '2B NVMe SSD (Gen4)', price: 260 },
            psu: { name: '1000W 80+ Gold', price: 165 },
            case: { name: 'Fractal Design Torrent', price: 190 },
            cooler: { name: 'Arctic Liquid Freezer II 360', price: 130 },
        },
    },

    // ─── WORKSTATION (Server-Grade) ───────────────────────

    {
        id: 'workstation-2000',
        budget: 2000,
        useCase: 'workstation',
        tier: 'Entry Server',
        name: 'Micro Server',
        description: 'Home lab, NAS, Docker host & lightweight VMs',
        parts: {
            cpu: { name: 'Intel Xeon E-2436', price: 345 },
            gpu: { name: 'Integrated UHD Graphics', price: 0 },
            motherboard: { name: 'Supermicro X13SEI-TF', price: 420 },
            memory: { name: '64GB ECC DDR5-4800 (2x32GB)', price: 280 },
            storage: { name: '2x 2TB Enterprise NVMe (RAID 1)', price: 380 },
            psu: { name: '750W 80+ Platinum', price: 150 },
            case: { name: 'Fractal Design Define 7', price: 160 },
            cooler: { name: 'Noctua NH-U12S', price: 70 },
        },
    },
    {
        id: 'workstation-4000',
        budget: 4000,
        useCase: 'workstation',
        tier: 'Mid Server',
        name: 'Rack-Ready Workhorse',
        description: 'Multi-VM host, database server & CI/CD pipeline runner',
        parts: {
            cpu: { name: 'AMD EPYC 4364P (16C/32T)', price: 699 },
            gpu: { name: 'NVIDIA T400 (management)', price: 120 },
            motherboard: { name: 'Supermicro H13SSL-N', price: 600 },
            memory: { name: '128GB ECC DDR5-4800 (4x32GB)', price: 520 },
            storage: { name: '2x 4TB Enterprise NVMe + 2x 8TB HDD', price: 850 },
            psu: { name: '1000W 80+ Platinum Redundant', price: 310 },
            case: { name: 'Rosewill RSV-L4412U (4U Rack)', price: 180 },
            cooler: { name: 'Noctua NH-U14S (SP6)', price: 120 },
        },
    },
    {
        id: 'workstation-8000',
        budget: 8000,
        useCase: 'workstation',
        tier: 'Enterprise',
        name: 'Enterprise Tower',
        description: 'High-density VMs, AI inference, large-scale databases & render farms',
        parts: {
            cpu: { name: 'AMD EPYC 4584PX (24C/48T)', price: 1399 },
            gpu: { name: 'NVIDIA RTX A4000 (16GB ECC)', price: 999 },
            motherboard: { name: 'Supermicro H13SSL-NT', price: 750 },
            memory: { name: '512GB ECC DDR5-4800 (8x64GB)', price: 2100 },
            storage: { name: '4x 4TB Enterprise NVMe (RAID 10) + 4x 16TB HDD', price: 2800 },
            psu: { name: '1600W 80+ Titanium Redundant', price: 520 },
            case: { name: 'Supermicro CSE-745TQ (4U Tower/Rack)', price: 380 },
            cooler: { name: 'Noctua NH-U14S (SP6)', price: 120 },
        },
    },
];