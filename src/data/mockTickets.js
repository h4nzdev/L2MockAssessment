// Mock Incident Data for L2 Helpdesk & Incident Triage Simulator
// Designed to simulate realistic Level 2 Technical Support at Retail POS & Store Server operations.

export const triageDrillSets = [
  {
    id: "drill-set-1",
    title: "Friday Evening Peak Rush Incident Surge",
    context: "It is 6:45 PM on a Friday peak trading window. 3 incoming escalations have arrived at the L2 queue simultaneously. Prioritize them (P1, P2, P3) based on business impact, revenue risk, and SLA urgency.",
    tickets: [
      {
        id: "INC-8812",
        title: "All 18 POS Lanes Failing Credit Card Authorization across 6 Regional Superstores",
        storeId: "District 4 (Stores 101, 104, 109, 112, 118, 120)",
        severity: "Critical",
        reportedBy: "District Operations Manager",
        impactDescription: "Customers abandoning carts at checkout lines. Cash-only mode initiated across 6 superstores during peak rush. Estimated revenue loss > $45,000/hr.",
        scope: "Multi-Store Fleet Outage",
        system: "Verifone EFT Payment Gateway / CloudHQ Transit",
        correctRank: 1,
        explanation: "P1 (Critical): Multi-store credit card authorization failure directly halts checkout revenue during peak trading hours. Highest revenue impact ($45k/hr) and widest customer impact."
      },
      {
        id: "INC-8819",
        title: "Store 402 Lane 3 Thermal Receipt Printer Offline; Lane 1, 2, 4, 5 Operational",
        storeId: "Store 402 - Cebu IT Park",
        severity: "Medium",
        reportedBy: "Store Shift Supervisor",
        impactDescription: "Register 3 cannot print paper receipts. Cashiers have shifted foot traffic to the other 4 functioning lanes. Store continues trading with minor line delays.",
        scope: "Single Lane / Isolated Peripheral",
        system: "Epson TM-T88VI Thermal Printer / USB Spooler",
        correctRank: 2,
        explanation: "P2 (Medium): Single peripheral failure in a multi-lane store. Moderate inconvenience, but business operations and revenue continue unaffected via adjacent lanes."
      },
      {
        id: "INC-8825",
        title: "Store 88 Training Mode Manager Override PIN Expired for New Cashier Onboarding",
        storeId: "Store 88 - Training Annex",
        severity: "Low",
        reportedBy: "Training Lead",
        impactDescription: "Practice terminal in back-office training room cannot execute mock refund training without updated supervisor override credentials.",
        scope: "Non-Production Training Room",
        system: "User Access Management / Training DB",
        correctRank: 3,
        explanation: "P3 (Low): Back-office training environment with zero customer or revenue impact. Standard administrative SLA (24h) applies."
      }
    ]
  },
  {
    id: "drill-set-2",
    title: "Morning Store Open & Inventory Sync Backlog",
    context: "Stores are opening for the 8:00 AM trading window. Three distinct issues report in from different regional hubs. Rank them by urgency and operational risk.",
    tickets: [
      {
        id: "INC-9104",
        title: "Store 205 Server Disk Full (100% /var/log); POS Terminals Dropping Offline Every 2 Mins",
        storeId: "Store 205 - Metro Manila Hub",
        severity: "Critical",
        reportedBy: "Store General Manager",
        impactDescription: "Local SQLite database cannot allocate journal space. All 8 registers crashing on item scan. Morning open delayed by 35 minutes.",
        scope: "Entire Store Server Failure",
        system: "Ubuntu In-Store Controller / SQLite Wal Log",
        correctRank: 1,
        explanation: "P1 (Critical): Store server disk exhaustion prevents database writes, crashing all lanes and halting store open. Immediate risk of store closure."
      },
      {
        id: "INC-9112",
        title: "Store 310 Promotional Campaign 'FlashSale-BOGO' Not Displaying on Loyalty Screen",
        storeId: "Store 310 - Davao Central",
        severity: "High",
        reportedBy: "Marketing Store Coordinator",
        impactDescription: "Promotional discount applies correctly at total checkout calculation, but secondary customer-facing LCD display shows default welcome message instead of animated banner.",
        scope: "Secondary Customer Display (Visual Only)",
        system: "Customer Pole Display Service (CFD-Daemon)",
        correctRank: 3,
        explanation: "P3 (Low/Medium): Visual display cosmetic discrepancy. The discount logic itself works in the core calculation engine, so sales proceed normally."
      },
      {
        id: "INC-9120",
        title: "Store 512 EOD Transaction Batch Sync Queue Backlogged with 1,420 Unsent Records",
        storeId: "Store 512 - Iloilo Megamall",
        severity: "High",
        reportedBy: "CloudHQ Automated Telemetry Monitor",
        impactDescription: "Sales from yesterday evening have not synchronized to Enterprise ERP. Financial reconciliation and daily inventory replenishment orders are delayed.",
        scope: "Store-wide Data Reconciliation",
        system: "RabbitMQ Sync Client / Outbox Queue",
        correctRank: 2,
        explanation: "P2 (High): Critical back-office data pipeline delay affecting daily supply chain and accounting, but store lanes remain open for live customer checkout."
      }
    ]
  },
  {
    id: "drill-set-3",
    title: "Holiday Season Concurrency & Security Alerts",
    context: "High-volume weekend sale. Automated security monitors and store dispatchers have submitted 3 emergency escalations.",
    tickets: [
      {
        id: "INC-9440",
        title: "Payment Terminal Firmware Tamper Alert Triggered on Lane 1 & Lane 2",
        storeId: "Store 102 - Makati Flagship",
        severity: "Critical",
        reportedBy: "PCI-DSS Automated Security Gateway",
        impactDescription: "PED hardware security module (HSM) detected casing integrity breach signal. PCI-DSS compliance requires immediate quarantine of registers to prevent card skimming.",
        scope: "Physical Security & Payment Risk",
        system: "Ingenico Lane 5000 HSM Core",
        correctRank: 1,
        explanation: "P1 (Critical): PCI-DSS security tamper alert represents immediate legal, regulatory, and customer card data theft liability. Immediate lane shutdown & hardware quarantine required."
      },
      {
        id: "INC-9448",
        title: "Store 220 2D Barcode Scanners Failing on QR Code E-Wallet Mobile Vouchers",
        storeId: "Store 220 - BGC High Street",
        severity: "High",
        reportedBy: "Front-End Lead",
        impactDescription: "Honeywell 1900G scanners read standard UPC barcodes fine, but fail on smartphone QR code vouchers. Cashiers must manually key in 16-digit voucher codes, causing long queues.",
        scope: "Store-wide QR Scanning Delay",
        system: "Honeywell Xenon USB Imager Driver",
        correctRank: 2,
        explanation: "P2 (High): Degrades cashier checkout velocity significantly during a high-traffic sale, though workarounds (manual entry) prevent complete sales blockage."
      },
      {
        id: "INC-9455",
        title: "Store 104 Nightly Sales Summary Report Email Has Missing Department Graph",
        storeId: "Store 104 - Alabang Town Center",
        severity: "Low",
        reportedBy: "Store Auditor",
        impactDescription: "Automated midnight PDF report email generated without the pie chart visual. Raw CSV table of numbers is intact and accurate.",
        scope: "Back-Office Reporting Cosmetic",
        system: "Crystal Reports PDF Exporter",
        correctRank: 3,
        explanation: "P3 (Low): Reporting formatting bug with no impact on store operations, trading, or revenue data integrity."
      }
    ]
  }
];

export const mockIncidentTickets = [
  {
    id: "INC-10492",
    storeId: "Store 402 - Cebu IT Park",
    storeName: "SSEQUEL Superstore #402",
    city: "Cebu City",
    terminalId: "REG-402-01 & REG-402-02",
    terminalModel: "NCR RealPOS 70",
    title: "POS Terminals Failing Credit Card Sync (HTTP 504)",
    severity: "Critical",
    slaMinutes: 15,
    openedAt: "10 mins ago",
    status: "OPEN",
    category: "Payment Gateway",
    reportedBy: "Maria Santos (Store Supervisor)",
    customerStatement: "Both checkout registers 1 and 2 freeze for 45 seconds when a customer taps or inserts a credit/debit card, then display 'ERROR 504: Payment Gateway Timeout'. Customers are leaving carts and cashiers are overwhelmed.",
    terminalLogs: `[2026-09-30 02:48:12.104] [INFO] [EFT-Core] Transaction initiated. Amount: $84.50, Tender: VISA_DEBIT
[2026-09-30 02:48:12.450] [DEBUG] [EFT-Core] Encrypted payload dispatched to CloudHQ proxy (10.200.4.12:5672)
[2026-09-30 02:48:27.452] [WARN] [EFT-Core] Socket timeout on port 5672. Retrying handshake (Attempt 1/3)...
[2026-09-30 02:48:42.455] [WARN] [EFT-Core] Socket timeout on port 5672. Retrying handshake (Attempt 2/3)...
[2026-09-30 02:48:57.458] [ERROR] [EFT-Core] HTTP 504 Gateway Timeout - No response from upstream host 10.200.4.12
[2026-09-30 02:48:57.460] [CRITICAL] [EFT-Core] Payment transaction ABORTED. Reversal packet queued in Outbox.
[2026-09-30 02:48:58.002] [ERROR] [POS-UI] Displaying modal: ERR_PAYMENT_GATEWAY_TIMEOUT`,
    diagnosticChecks: [
      {
        id: "ping_gateway",
        name: "Ping Local Store Gateway (192.168.1.1)",
        command: "Test-Connection -Target 192.168.1.1 -Count 4",
        status: "SUCCESS",
        output: "Store Router Gateway (192.168.1.1): Reachable | 4 packets transmitted, 4 received | Round-trip: min=1.2ms, avg=2.1ms, max=3.8ms."
      },
      {
        id: "ping_cloudhq",
        name: "Ping Enterprise CloudHQ Core (10.200.4.12)",
        command: "Test-NetConnection -ComputerName 10.200.4.12 -Port 5672",
        status: "FAILED",
        output: "CloudHQ EFT Bridge (10.200.4.12:5672): Connection FAILED | TcpTestSucceeded: False | Network path blocked or CloudHQ VPN transit down."
      },
      {
        id: "check_db",
        name: "Check Local SQLite DB Lock State",
        command: "Invoke-Sqlcmd -Query 'PRAGMA lock_status;'",
        status: "SUCCESS",
        output: "Local Database: Healthy | SQLite In-Memory Buffer: NORMAL | Open transactions: 0 | Database lock state: UNLOCKED."
      },
      {
        id: "check_rabbitmq",
        name: "Inspect RabbitMQ Outbox Backlog",
        command: "rabbitmqctl list_queues name messages_ready consumers",
        status: "WARN",
        output: "Queue: outbox_eft_transactions | Messages Ready: 42 pending | Consumers: 0 (DISCONNECTED from remote exchange)."
      }
    ],
    workarounds: [
      {
        id: "restart_eft_service",
        title: "Restart POS Local EFT Service (POS-EFT-Daemon)",
        description: "Restarts the local payment handler daemon on Register 1 and 2.",
        isCorrect: false,
        feedback: "Restarted POS-EFT-Daemon successfully (PID: 4912), but subsequent card transaction still failed with HTTP 504 because the upstream enterprise network route to CloudHQ (10.200.4.12:5672) is down at the ISP/VPN layer. This is an infrastructure issue requiring Tier 3 Network Escalation."
      },
      {
        id: "clear_cache",
        title: "Clear In-Memory Browser & POS Cache",
        description: "Purges temporary browser session data and local storage.",
        isCorrect: false,
        feedback: "Cache cleared, but this has no effect on remote EFT socket timeouts on 10.200.4.12:5672."
      },
      {
        id: "switch_offline_mode",
        title: "Enable Standalone Store Offline Store-and-Forward Mode",
        description: "Switches POS terminals into encrypted SAF mode for transactions under $50.",
        isCorrect: true,
        isMitigationOnly: true,
        feedback: "Temporary Mitigation: Store-and-Forward mode activated. Transactions under $50 are encrypted and stored locally in Outbox. However, permanent resolution requires L3 Network Escalation to restore the CloudHQ VPN bridge."
      }
    ],
    correctResolutionType: "escalate",
    correctWorkaroundId: null,
    idealEscalation: {
      impact: "Store 402 all lanes unable to process live credit/debit card authorizations. High revenue risk during peak hours.",
      suspectedCause: "Upstream VPN / routing outage to CloudHQ EFT endpoint (10.200.4.12:5672). Local gateway is healthy, but CloudHQ port test fails with 100% timeout.",
      criticalLog: "HTTP 504 Gateway Timeout - No response from upstream host 10.200.4.12:5672",
      requiredSteps: "Verified local gateway 192.168.1.1 ping (OK); tested TCP port 5672 to 10.200.4.12 (FAILED); verified RabbitMQ queue has 42 pending transactions; enabled temporary SAF mitigation."
    }
  },
  {
    id: "INC-10518",
    storeId: "Store 104 - Makati Central",
    storeName: "SSEQUEL Hypermarket #104",
    city: "Makati City",
    terminalId: "REG-104-03",
    terminalModel: "Epson TM-T88VI / NCR POS",
    title: "Thermal Printer Spooler Deadlock (ERR_PRINTER_OFFLINE)",
    severity: "Medium",
    slaMinutes: 30,
    openedAt: "18 mins ago",
    status: "OPEN",
    category: "Peripheral / Hardware",
    reportedBy: "Carlo D. (Cashier Lane 3)",
    customerStatement: "Register 3 suddenly stopped printing receipts. When we press Print, the screen says 'Printer not responding (0x800706BA)'. The blue power light on the Epson printer is solid on, paper roll is full, but nothing prints.",
    terminalLogs: `[2026-09-30 02:30:11.002] [INFO] [PrintManager] PrintJob #8819 submitted for Order #ORD-9912
[2026-09-30 02:30:11.015] [DEBUG] [Spooler-Win32] OpenPrinterHandle('EPSON_TM_T88VI_USB') returned HANDLE: 0x4A10
[2026-09-30 02:30:16.120] [WARN] [Spooler-Win32] Spooler RPC communication timeout. Error: 0x800706BA (RPC Server Unavailable)
[2026-09-30 02:30:16.125] [ERROR] [PrintManager] Spooler deadlock detected: 4 print jobs frozen in queue 'EPSON_TM_T88VI_USB'
[2026-09-30 02:30:16.128] [ERROR] [POS-Core] Device status: OFFLINE. Error code: ERR_PRINTER_OFFLINE`,
    diagnosticChecks: [
      {
        id: "check_spooler",
        name: "Check Windows Print Spooler Service Status",
        command: "Get-Service -Name Spooler",
        status: "WARN",
        output: "Status: Stopped | ServiceName: Spooler | DisplayName: Print Spooler | StartType: Automatic | CrashReason: Corrupted buffer in spoolsv.exe."
      },
      {
        id: "check_usb",
        name: "Inspect USB Peripheral Bus Enumeration",
        command: "Get-PnpDevice -Class 'Printer' -Status 'OK'",
        status: "SUCCESS",
        output: "DeviceID: USB\\VID_04B8&PID_0202 (EPSON TM-T88VI) | Status: OK | Driver: epson_tm_v8.sys | Connection: High-Speed USB 2.0 Port 3."
      },
      {
        id: "check_disk",
        name: "Check C:\\Windows\\System32\\spool\\PRINTERS directory",
        command: "Get-ChildItem C:\\Windows\\System32\\spool\\PRINTERS",
        status: "WARN",
        output: "Directory has 4 orphaned .SHD and .SPL locked files (Total: 12.4 MB) causing RPC deadlock."
      }
    ],
    workarounds: [
      {
        id: "clear_spooler_restart",
        title: "Flush Spooler Directory (.SHD/.SPL) and Restart Spooler Service",
        description: "Kills stuck spoolsv process, purges orphaned queue files in C:\\Windows\\System32\\spool\\PRINTERS, and starts Print Spooler service.",
        isCorrect: true,
        feedback: "SUCCESS: Corrupt spool files deleted and Print Spooler service restarted (PID: 3824). Register 3 successfully printed test receipt. Ticket resolved at L2!"
      },
      {
        id: "reinstall_pos_app",
        title: "Full POS Application Reinstall",
        description: "Uninstalls and re-downloads the entire 2GB POS client application.",
        isCorrect: false,
        feedback: "Unnecessary 45-minute downtime. The issue is a standard OS Print Spooler deadlock, not a corrupted POS binary."
      },
      {
        id: "reboot_terminal",
        title: "Reboot Terminal Without Clearing Spooler",
        description: "Performs standard OS restart.",
        isCorrect: false,
        feedback: "Reboot completed, but the corrupted .SHD files in C:\\Windows\\System32\\spool\\PRINTERS immediately caused spoolsv.exe to freeze again upon boot."
      }
    ],
    correctResolutionType: "workaround",
    correctWorkaroundId: "clear_spooler_restart",
    idealEscalation: {
      impact: "Not required — resolvable at L2 via standard spooler flush.",
      suspectedCause: "Orphaned print job deadlock in Windows spooler.",
      criticalLog: "Error: 0x800706BA (RPC Server Unavailable) / ERR_PRINTER_OFFLINE",
      requiredSteps: "Inspected spooler service; deleted .SHD/.SPL lockfiles; restarted Spooler service."
    }
  },
  {
    id: "INC-10534",
    storeId: "Store 201 - Quezon City Megamall",
    storeName: "SSEQUEL Department Store #201",
    city: "Quezon City",
    terminalId: "Store Server (SRV-201-DB)",
    terminalModel: "Ubuntu Linux In-Store Controller",
    title: "Database Exclusive Write Lock Deadlock (ERR_DB_LOCK)",
    severity: "Critical",
    slaMinutes: 20,
    openedAt: "12 mins ago",
    status: "OPEN",
    category: "Database & Concurrency",
    reportedBy: "Jason Cruz (Store Operations)",
    customerStatement: "All 12 registers across the whole store are showing spinning wheels on tender checkout. Cashiers cannot save completed transactions. Screen displays 'Database transaction timeout: Locked by process'.",
    terminalLogs: `[2026-09-30 02:41:00.112] [INFO] [EOD-Worker] Background EOD stock reconciliation job started (PID: 8812)
[2026-09-30 02:41:00.118] [WARN] [SQLite-Engine] EXCLUSIVE table lock acquired on table 'Orders' and 'OrderItems' by PID 8812
[2026-09-30 02:41:05.890] [ERROR] [EOD-Worker] Process 8812 encountered SIGSEGV while parsing corrupt barcode index. Worker crashed without releasing EXCLUSIVE lock!
[2026-09-30 02:41:10.005] [ERROR] [POS-Lane-01] INSERT INTO Orders failed: SQLITE_BUSY (5) - database is locked
[2026-09-30 02:41:10.008] [ERROR] [POS-Lane-02] INSERT INTO Orders failed: SQLITE_BUSY (5) - database is locked
[2026-09-30 02:41:10.012] [ERROR] [POS-Lane-03] INSERT INTO Orders failed: SQLITE_BUSY (5) - database is locked
[2026-09-30 02:41:15.000] [CRITICAL] [HealthMonitor] 12 POS lanes blocked waiting for SQLite lock release. Error: ERR_DB_LOCK`,
    diagnosticChecks: [
      {
        id: "check_db_processes",
        name: "Inspect Active In-Store Database Connection Pool",
        command: "fuser -v /var/data/pos_store.db",
        status: "FAILED",
        output: "Zombie Lock File Detected: /var/data/pos_store.db-journal owned by crashed PID 8812 (state: zombie/defunct). 12 threads in D-state waiting on mutex."
      },
      {
        id: "check_disk_space",
        name: "Check Store Controller Disk Space & Inodes",
        command: "df -h /var/data",
        status: "SUCCESS",
        output: "Filesystem: /dev/sda1 | Size: 250G | Used: 42G (18%) | Avail: 198G | Inodes: 94% free. Disk space is NOT the issue."
      },
      {
        id: "test_db_query",
        name: "Test Direct Read Query on Stores Table",
        command: "sqlite3 /var/data/pos_store.db 'SELECT COUNT(*) FROM Stores;'",
        status: "WARN",
        output: "Read Query OK (Count: 1). Write Queries (INSERT/UPDATE): SQLITE_BUSY (Database is locked)."
      }
    ],
    workarounds: [
      {
        id: "kill_zombie_and_unlock",
        title: "Kill Zombie PID 8812 & Execute WAL Database Checkpoint / Unlock Procedure",
        description: "Terminates the defunct worker process, clears stale WAL shm/wal lock handles, and runs 'PRAGMA wal_checkpoint(TRUNCATE);'.",
        isCorrect: true,
        feedback: "SUCCESS: Zombie lock removed, database unlocked and rolled back cleanly. All 12 POS registers successfully resumed checkout within 4 seconds. Ticket resolved at L2!"
      },
      {
        id: "delete_database",
        title: "Delete /var/data/pos_store.db File and Recreate Empty Tables",
        description: "Drops the active store database to clear the lock.",
        isCorrect: false,
        feedback: "CATASTROPHIC ACTION: Deleting the active store database destroys all today's un-synced orders and transactions! Never delete the production database."
      },
      {
        id: "restart_cashier_registers",
        title: "Reboot All 12 Cashier Registers",
        description: "Reboots client terminals.",
        isCorrect: false,
        feedback: "The lock resides on the central Store Controller (/var/data/pos_store.db). Rebooting the registers does not clear the zombie lock on the store server."
      }
    ],
    correctResolutionType: "workaround",
    correctWorkaroundId: "kill_zombie_and_unlock",
    idealEscalation: {
      impact: "Entire store unable to checkout.",
      suspectedCause: "Zombie process 8812 holding exclusive write lock.",
      criticalLog: "SQLITE_BUSY (5) - database is locked / ERR_DB_LOCK",
      requiredSteps: "Identified zombie PID 8812; terminated defunct lock handle; ran WAL checkpoint."
    }
  },
  {
    id: "INC-10555",
    storeId: "Store 305 - Davao Ecoland",
    storeName: "SSEQUEL Convenience #305",
    city: "Davao City",
    terminalId: "REG-305-01",
    terminalModel: "Honeywell Xenon 1900G / NCR 70",
    title: "USB Barcode Scanner Sending Garbled Characters (ERR_BARCODE_MALFUNCTION)",
    severity: "Low",
    slaMinutes: 45,
    openedAt: "25 mins ago",
    status: "OPEN",
    category: "Peripheral / Hardware",
    reportedBy: "Ana Belen (Cashier)",
    customerStatement: "Whenever I scan a carton of milk (UPC 049000000443), the POS screen enters weird symbols like '@#49000&443' and says 'Product Not Found'. Manual barcode typing works fine.",
    terminalLogs: `[2026-09-30 02:15:30.450] [DEBUG] [HID-Keyboard] Raw HID keystroke input received on /dev/input/event3 (Honeywell 1900G)
[2026-09-30 02:15:30.455] [WARN] [Scanner-Driver] Non-standard keyboard layout detected: active layout is FR-BE (French-Belgian Azerty) instead of US-English QWERTY!
[2026-09-30 02:15:30.460] [INFO] [POS-Input] Barcode received: '@#49000&443' (Mapped from shifted Azerty digits)
[2026-09-30 02:15:30.465] [WARN] [CatalogSearch] SELECT * FROM Products WHERE Barcode = '@#49000&443' returned 0 records.
[2026-09-30 02:15:30.470] [ERROR] [POS-UI] Error notification: ERR_BARCODE_MALFUNCTION - Product Not Found`,
    diagnosticChecks: [
      {
        id: "check_keyboard_layout",
        name: "Check POS OS Active Keyboard Layout & Scanner Profile",
        command: "Get-WinUserLanguageList",
        status: "WARN",
        output: "Active OS Input Locale: fr-BE (Azerty) - Accidental shortcut Ctrl+Shift was triggered by cashier, changing keyboard map."
      },
      {
        id: "check_scanner_hardware",
        name: "Verify Honeywell Hardware Self-Diagnostic",
        command: "Test-ScannerHealth -Port USB",
        status: "SUCCESS",
        output: "Optical sensor: 100% | Laser Aim: OK | Firmware: v1.42 (Latest) | Hardware health: 100% HEALTHY."
      }
    ],
    workarounds: [
      {
        id: "reset_input_locale",
        title: "Reset OS Input Locale to 'en-US' and Lock Language Bar",
        description: "Switches keyboard input mapping back to standard US QWERTY and disables keyboard layout hotkeys.",
        isCorrect: true,
        feedback: "SUCCESS: Keyboard input locale reset to en-US. Barcode scan now immediately returns clean '049000000443' and item loads into basket. Issue resolved!"
      },
      {
        id: "replace_scanner",
        title: "Request Overnight Hardware Replacement for Honeywell Scanner",
        description: "Dispatches a new scanner unit via courier.",
        isCorrect: false,
        feedback: "Unnecessary equipment replacement cost ($350). The scanner hardware is in perfect working order; only the OS keyboard language setting was changed."
      }
    ],
    correctResolutionType: "workaround",
    correctWorkaroundId: "reset_input_locale",
    idealEscalation: {
      impact: "Single register barcode misreads.",
      suspectedCause: "Keyboard input locale switched to Azerty.",
      criticalLog: "Non-standard keyboard layout detected / ERR_BARCODE_MALFUNCTION",
      requiredSteps: "Checked active input locale; restored en-US QWERTY."
    }
  },
  {
    id: "INC-10582",
    storeId: "Store 501 - Pasig Mega Mart",
    storeName: "SSEQUEL Mart #501",
    city: "Pasig City",
    terminalId: "Store Server & Cloud Sync Daemon",
    terminalModel: "NCR Store Server Pro",
    title: "RabbitMQ Transaction Sync Backlog (ERR_SYNC_TIMEOUT)",
    severity: "High",
    slaMinutes: 30,
    openedAt: "15 mins ago",
    status: "OPEN",
    category: "Data Synchronization",
    reportedBy: "Central ERP Monitoring Bot",
    customerStatement: "Store 501 has 890 sales orders stuck in 'pending_sync' state. Enterprise reporting is 4 hours behind for this store. In-store registers are working, but data is not reaching CloudHQ.",
    terminalLogs: `[2026-09-30 02:00:10.890] [INFO] [SyncWorker] Starting batch sync for 100 orders...
[2026-09-30 02:00:11.120] [ERROR] [RabbitMQ-Client] AMQP connection handshake failed on amqp://cloudhq.retail.internal:5672
[2026-09-30 02:00:11.125] [ERROR] [RabbitMQ-Client] Reason: PRECONDITION_FAILED - unknown exchange 'pos.transactions.v2' (404 NOT_FOUND)
[2026-09-30 02:00:11.130] [CRITICAL] [SyncWorker] Message broker rejected exchange name. Sync daemon paused in retry loop (Backoff: 60s).
[2026-09-30 02:00:11.135] [ERROR] [Telemetry] Error code: ERR_SYNC_TIMEOUT - 890 transactions delayed in Outbox queue`,
    diagnosticChecks: [
      {
        id: "check_amqp_config",
        name: "Audit Local Sync Client Configuration File (/etc/pos/sync.conf)",
        command: "cat /etc/pos/sync.conf | grep EXCHANGE",
        status: "WARN",
        output: "EXCHANGE_NAME=pos.transactions.v2 (Deprecated during yesterday's CloudHQ migration; CloudHQ now uses 'pos.transactions.v3')."
      },
      {
        id: "ping_amqp_host",
        name: "Test Network Connectivity to amqp://cloudhq.retail.internal:5672",
        command: "nc -zv cloudhq.retail.internal 5672",
        status: "SUCCESS",
        output: "Connection to cloudhq.retail.internal 5672 port [tcp/amqp] succeeded! Network path is OPEN."
      }
    ],
    workarounds: [
      {
        id: "update_exchange_and_resync",
        title: "Update /etc/pos/sync.conf to Exchange 'pos.transactions.v3' & Restart Sync Service",
        description: "Corrects the AMQP exchange name to match the updated CloudHQ schema and forces queue replay.",
        isCorrect: true,
        feedback: "SUCCESS: Exchange updated to 'pos.transactions.v3' and sync service restarted. All 890 backlogged records successfully flushed to CloudHQ in 18 seconds. Backlog cleared!"
      },
      {
        id: "truncate_outbox",
        title: "Purge and Truncate Outbox Table to Clear Count",
        description: "Executes DELETE FROM Outbox_Sync.",
        isCorrect: false,
        feedback: "DATA LOSS: Purging the table deletes $42,000 in un-synced store sales records without transmitting them to financial accounting!"
      }
    ],
    correctResolutionType: "workaround",
    correctWorkaroundId: "update_exchange_and_resync",
    idealEscalation: {
      impact: "890 orders delayed in cloud sync.",
      suspectedCause: "Outdated AMQP exchange name in sync.conf.",
      criticalLog: "PRECONDITION_FAILED - unknown exchange 'pos.transactions.v2' / ERR_SYNC_TIMEOUT",
      requiredSteps: "Verified AMQP network reachable; identified exchange version mismatch; updated sync.conf."
    }
  },
  {
    id: "INC-10601",
    storeId: "Store 112 - Ortigas Express",
    storeName: "SSEQUEL Express #112",
    city: "Pasig City",
    terminalId: "Store Gateway (RTR-112)",
    terminalModel: "Cisco RV340 / Fiber ONT",
    title: "Complete Store Server Outage (ERR_STORE_SERVER_OFFLINE)",
    severity: "Critical",
    slaMinutes: 15,
    openedAt: "8 mins ago",
    status: "OPEN",
    category: "Store Server Outage",
    reportedBy: "Derrick Lim (District Tech)",
    customerStatement: "Store 112 is completely dark. All registers are unable to reach the store server (192.168.1.100). Store staff report a burning smell near the back-office server rack and the UPS battery is beeping continuously.",
    terminalLogs: `[2026-09-30 02:52:00.010] [CRITICAL] [Watchdog] Heartbeat lost for In-Store Server 192.168.1.100
[2026-09-30 02:52:05.120] [ERROR] [POS-Lane-01] Unable to reach Store Controller: Host Unreachable (192.168.1.100)
[2026-09-30 02:52:05.125] [ERROR] [POS-Lane-02] Unable to reach Store Controller: Host Unreachable (192.168.1.100)
[2026-09-30 02:52:10.000] [ALERT] [UPS-SNMP] APC Smart-UPS 1500: On-Battery event, Output Overload (120%), Inverter Fault!
[2026-09-30 02:52:12.000] [CRITICAL] [NOC] Store 112 classified as HARDWARE_POWER_FAILURE. Code: ERR_STORE_SERVER_OFFLINE`,
    diagnosticChecks: [
      {
        id: "ping_server",
        name: "Ping In-Store Server (192.168.1.100)",
        command: "ping -c 4 192.168.1.100",
        status: "FAILED",
        output: "Destination Host Unreachable. 100% packet loss. Server hardware has completely lost electrical power."
      },
      {
        id: "check_ups_snmp",
        name: "Query UPS Battery Management SNMP Agent",
        command: "snmpwalk -v2c -c public 192.168.1.5 .1.3.6.1.4.1.318",
        status: "FAILED",
        output: "UPS Hardware Fault: Inverter blown, burning odor reported on-site. AC output disconnected to prevent fire."
      }
    ],
    workarounds: [
      {
        id: "remote_reboot",
        title: "Send Remote IPMI Reboot Command",
        description: "Attempts out-of-band IPMI power-on signal.",
        isCorrect: false,
        feedback: "IPMI unreachable. The physical UPS has tripped its breaker and has zero electrical output. Remote commands cannot power on physical equipment without AC electricity."
      },
      {
        id: "software_restart",
        title: "Restart POS Application Server Service",
        description: "Attempts SSH connection.",
        isCorrect: false,
        feedback: "SSH Connection timed out: No route to host. The machine is physically unpowered."
      }
    ],
    correctResolutionType: "escalate",
    correctWorkaroundId: null,
    idealEscalation: {
      impact: "Store 112 completely offline; all POS registers dead. Store unable to trade.",
      suspectedCause: "Physical hardware power failure in back-office UPS / Server PSU with burning odor.",
      criticalLog: "APC Smart-UPS 1500: Output Overload / Inverter Fault / ERR_STORE_SERVER_OFFLINE",
      requiredSteps: "Verified ping to 192.168.1.100 failed; confirmed UPS SNMP inverter failure; instructed store staff to isolate breaker and requested emergency On-Site Field Engineer dispatch."
    }
  },
  {
    id: "INC-10640",
    storeId: "Store 302 - BGC Central",
    storeName: "SSEQUEL Department #302",
    city: "Taguig City",
    terminalId: "REG-302-04",
    terminalModel: "Verifone M400 / NCR RealPOS",
    title: "Verifone PIN Pad Serial Baud Rate Mismatch (ERR_PINPAD_COMM)",
    severity: "High",
    slaMinutes: 30,
    openedAt: "4 mins ago",
    status: "OPEN",
    category: "Payment Gateway",
    reportedBy: "Grace Tan (Supervisor)",
    customerStatement: "Register 4 PIN pad shows 'CONNECTING...' indefinitely on card insert. Cashier terminal log says 'Serial Port COM3 parity error / unexpected baud rate'.",
    terminalLogs: `[2026-09-30 02:55:01.210] [INFO] [EFT-Driver] Initializing RS232 Serial Port COM3...
[2026-09-30 02:55:01.220] [DEBUG] [EFT-Driver] Configured COM3: Baud=9600, DataBits=8, Parity=None, StopBits=1
[2026-09-30 02:55:04.300] [ERROR] [EFT-Driver] Framing error on COM3: Verifone M400 firmware expecting 115200 baud!
[2026-09-30 02:55:05.100] [CRITICAL] [EFT-Driver] Handshake failed after 3 attempts. Error: ERR_PINPAD_COMM`,
    diagnosticChecks: [
      {
        id: "check_com_port",
        name: "Query POS Peripheral Serial Port Configuration",
        command: "Get-WmiObject Win32_SerialPort | Select Name, BaudRate",
        status: "WARN",
        output: "Port: COM3 | CurrentBaud: 9600 | RequiredDeviceBaud: 115200 (Mismatch detected)."
      },
      {
        id: "test_pinpad_echo",
        name: "Send Verifone Terminal Ping Command (ENQ/ACK)",
        command: "Test-PinPadComm -Port COM3",
        status: "FAILED",
        output: "Response: NO_ACK (Framing Error). Device is powered on but cannot parse 9600 baud serial stream."
      }
    ],
    workarounds: [
      {
        id: "fix_baud_rate",
        title: "Update COM3 Baud Rate to 115200 in /etc/pos/eft.json & Reload Daemon",
        description: "Sets baud rate to 115200 to match Verifone M400 firmware specification.",
        isCorrect: true,
        feedback: "SUCCESS: Baud rate synchronized to 115200. Verifone PIN pad completed ENQ/ACK handshake in 200ms. Test card tap successful!"
      },
      {
        id: "replace_pinpad",
        title: "RMA Replace PIN Pad Hardware",
        description: "Dispatches courier replacement.",
        isCorrect: false,
        feedback: "Unnecessary hardware swap. The device hardware is completely intact; only the driver baud rate setting was misconfigured."
      }
    ],
    correctResolutionType: "workaround",
    correctWorkaroundId: "fix_baud_rate",
    idealEscalation: {
      impact: "Single register PIN pad unable to process cards.",
      suspectedCause: "Serial COM3 baud rate mismatch (9600 vs 115200).",
      criticalLog: "Framing error on COM3 / ERR_PINPAD_COMM",
      requiredSteps: "Checked serial port configuration; updated baud rate to 115200; reloaded EFT daemon."
    }
  },
  {
    id: "INC-10677",
    storeId: "Store 415 - Cebu Seaside",
    storeName: "SSEQUEL Seaside #415",
    city: "Cebu City",
    terminalId: "Store Controller (SRV-415-PROMO)",
    terminalModel: "NCR Promotion Engine V4",
    title: "Promotional Pricing Engine JSON Deserialization Fault (ERR_PROMO_SYNC_FAIL)",
    severity: "High",
    slaMinutes: 30,
    openedAt: "2 mins ago",
    status: "OPEN",
    category: "Data Synchronization",
    reportedBy: "Karen Cruz (Lead Cashier)",
    customerStatement: "Whenever cashiers scan items on the 'Weekend 20% OFF' promotion, the POS terminal throws an unhandled exception: 'JSON Syntax Error: Unexpected token in promo payload'.",
    terminalLogs: `[2026-09-30 02:58:12.450] [INFO] [PromoEngine] Applying campaign 'WEEKEND_20_OFF' (ID: PR-8812)
[2026-09-30 02:58:12.455] [DEBUG] [PromoEngine] Parsing /var/data/promotions/PR-8812.json...
[2026-09-30 02:58:12.460] [ERROR] [PromoEngine] SyntaxError: Unexpected trailing comma at line 14, column 8 in PR-8812.json
[2026-09-30 02:58:12.465] [CRITICAL] [PromoEngine] Promotion calculation aborted. Item priced at standard non-discounted rate!
[2026-09-30 02:58:12.470] [ERROR] [Telemetry] Error code: ERR_PROMO_SYNC_FAIL`,
    diagnosticChecks: [
      {
        id: "validate_promo_json",
        name: "Validate Local Promotion JSON File Syntax",
        command: "jq . /var/data/promotions/PR-8812.json",
        status: "FAILED",
        output: "parse error: Expected another key-value pair at line 14, column 8 (invalid trailing comma)."
      },
      {
        id: "test_cloud_promo_api",
        name: "Query CloudHQ Promotion Master Catalog API",
        command: "curl -s http://cloudhq.retail.internal/api/v1/promos/PR-8812",
        status: "SUCCESS",
        output: "CloudHQ Master Catalog has valid, verified JSON payload (v1.4, 0 syntax errors)."
      }
    ],
    workarounds: [
      {
        id: "force_resync_promo",
        title: "Force Clean Re-Download of Promotion Cache from CloudHQ API",
        description: "Purges corrupted local PR-8812.json file and forces fresh pull from CloudHQ master repository.",
        isCorrect: true,
        feedback: "SUCCESS: Corrupted local file purged and clean JSON re-downloaded from CloudHQ. Validated with jq (0 errors). Promotions now calculating 20% discount flawlessly!"
      },
      {
        id: "disable_promotions",
        title: "Disable All Store Discounts System-Wide",
        description: "Deactivates the promotion calculation engine.",
        isCorrect: false,
        feedback: "POOR CUSTOMER EXPERIENCE: Disabling all discounts sparks customer outrage and price discrepancies at checkout."
      }
    ],
    correctResolutionType: "workaround",
    correctWorkaroundId: "force_resync_promo",
    idealEscalation: {
      impact: "Store 415 discounts failing on weekend campaign.",
      suspectedCause: "Corrupted local promotion JSON file with trailing comma syntax error.",
      criticalLog: "SyntaxError: Unexpected trailing comma in PR-8812.json / ERR_PROMO_SYNC_FAIL",
      requiredSteps: "Validated JSON syntax with jq; queried CloudHQ master API; purged and re-synced clean promotion file."
    }
  }
];

const STORE_LOCATIONS = [
  { storeId: "Store 101 - Manila Flagship", storeName: "SSEQUEL Flagship #101", city: "Manila" },
  { storeId: "Store 108 - Alabang Grand", storeName: "SSEQUEL Supermart #108", city: "Muntinlupa" },
  { storeId: "Store 204 - QC North Mall", storeName: "SSEQUEL Department #204", city: "Quezon City" },
  { storeId: "Store 308 - BGC High Street", storeName: "SSEQUEL Express #308", city: "Taguig City" },
  { storeId: "Store 412 - Cebu IT Park", storeName: "SSEQUEL Superstore #412", city: "Cebu City" },
  { storeId: "Store 518 - Davao Central", storeName: "SSEQUEL Hypermarket #518", city: "Davao City" }
];

export function generateRandomIncident() {
  const template = mockIncidentTickets[Math.floor(Math.random() * mockIncidentTickets.length)];
  const store = STORE_LOCATIONS[Math.floor(Math.random() * STORE_LOCATIONS.length)];
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const laneNum = Math.floor(1 + Math.random() * 12);

  return {
    ...template,
    id: `INC-${randomNum}`,
    storeId: store.storeId,
    storeName: store.storeName,
    city: store.city,
    terminalId: `REG-${randomNum.toString().slice(-3)}-0${laneNum}`,
    openedAt: "Just now (Live Escalation)",
    status: "OPEN",
    remainingSeconds: template.slaMinutes * 60,
    slaBreached: false,
    runDiagnostics: [],
    resolutionApplied: null,
    escalationSubmitted: null
  };
}

