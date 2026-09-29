// Mock Incident Data for Hands-On L2 Incident Troubleshooting Simulator
// Focus: Hands-On SQL Database Troubleshooting & PowerShell System Automation where the user writes and executes the fix.

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
  }
];

export const mockIncidentTickets = [
  // =========================================================================
  // SQL TROUBLESHOOTING INCIDENTS
  // =========================================================================
  {
    id: "INC-10492",
    envType: "sql",
    storeId: "Store 402 - Cebu IT Park",
    storeName: "SSEQUEL Superstore #402",
    city: "Cebu City",
    terminalId: "Store Database Server (SRV-402)",
    terminalModel: "In-Store Controller / Relational DB",
    title: "Batch Sync Stalled: Reset Failed Payment Queue to Pending Status",
    severity: "Critical",
    slaMinutes: 15,
    openedAt: "4 mins ago",
    status: "OPEN",
    category: "SQL Database Troubleshooting",
    reportedBy: "Maria Santos (Store Supervisor)",
    affectedHost: "SRV-402-DB (192.168.4.10)",
    affectedService: "CloudHQ AMQP Outbox Sync Engine / Transactions Table",
    businessImpact: "18 completed customer credit card transactions totaling $1,420.50 are blocked in local queue. ERP sales reconciliation and credit ledger audits are failing.",
    l1TriageNotes: "L1 verified store WAN connectivity is 100% stable (ping 12ms to HQ). L1 restarted sync service, but daemon rejects records in 'FAILED_GATEWAY' status and halts retries.",
    timeline: [
      "02:45:10 AM - Store ISP experienced a 2-minute WAN gateway packet drop during morning peak.",
      "02:46:02 AM - Outbox sync worker attempted batched HTTP POST to CloudHQ; received 504 Gateway Timeout.",
      "02:46:05 AM - Worker tagged all 18 pending records with terminal status 'FAILED_GATEWAY'.",
      "02:48:12 AM - Network restored, but SyncDaemon skips 'FAILED_GATEWAY' status by design.",
      "02:50:00 AM - Store Supervisor escalated to L2 NOC Helpdesk as P1 Revenue Audit Risk."
    ],
    incidentNarrative: "Following a transient WAN flicker at Store 402, 18 credit card transaction records became stuck in a poison state ('FAILED_GATEWAY') in the local 'Transactions' table. The CloudHQ AMQP Outbox daemon is hardcoded to only poll and process records with status = 'PENDING_SYNC'. As a result, the sync pipeline is permanently stalled for these transactions until an L2 Engineer resets them via SQL.",
    incidentObjective: "Write a SQL UPDATE query on the 'Transactions' table to reset the 'status' column from 'FAILED_GATEWAY' back to 'PENDING_SYNC' for Store ID 402.",
    starterCode: `-- Write your SQL UPDATE query to reset failed transaction records for Store 402
UPDATE Transactions
SET status = 'PENDING_SYNC'
WHERE ...;`,
    expectedSolution: `UPDATE Transactions SET status = 'PENDING_SYNC' WHERE store_id = 402 AND status = 'FAILED_GATEWAY';`,
    validationKeywords: ["update", "transactions", "set", "status", "pending_sync", "402"],
    validationRegex: [/update\s+transactions\s+set\s+status\s*=\s*['"]PENDING_SYNC['"]/i, /(where.*store_id\s*=\s*402|where.*402)/i],
    verificationExplanation: "Executing UPDATE Transactions SET status = 'PENDING_SYNC' WHERE store_id = 402 AND status = 'FAILED_GATEWAY' clears the poison state and allows the CloudHQ AMQP daemon to dequeue and transmit all 18 pending orders.",
    hints: [
      "Target table: Transactions",
      "Set column 'status' to 'PENDING_SYNC'",
      "Filter with WHERE store_id = 402 AND status = 'FAILED_GATEWAY'"
    ],
    diagnosticChecks: [
      {
        id: "check_failed_tx",
        name: "Query Transactions with FAILED_GATEWAY in Store 402",
        command: "SELECT transaction_id, store_id, terminal_id, amount, status FROM Transactions WHERE store_id = 402;",
        status: "WARN",
        output: "Found 18 records in 'FAILED_GATEWAY' state. Total un-synced value: $1,420.50."
      },
      {
        id: "check_db_integrity",
        name: "Check Foreign Key Integrity between Orders and Transactions",
        command: "PRAGMA foreign_key_check;",
        status: "SUCCESS",
        output: "0 constraint violations. Relational schema is healthy."
      }
    ],
    terminalLogs: `[2026-09-30 02:48:12.104] [WARN] [SyncDaemon] 18 records flagged with status 'FAILED_GATEWAY' in table Transactions.
[2026-09-30 02:48:12.450] [ERROR] [SyncDaemon] Influx queue paused for Store 402: Unresolved error state.
[2026-09-30 02:48:15.002] [INFO] [L2-Helpdesk] Action Required: Execute SQL fix to reset status to 'PENDING_SYNC'.`
  },
  {
    id: "INC-10534",
    envType: "sql",
    storeId: "Store 201 - Quezon City Megamall",
    storeName: "SSEQUEL Department Store #201",
    city: "Quezon City",
    terminalId: "SRV-201-DB",
    terminalModel: "In-Store AlaSQL Controller",
    title: "Clear Stale Transaction Table Locks to Unlock Checkout Registers",
    severity: "Critical",
    slaMinutes: 20,
    openedAt: "8 mins ago",
    status: "OPEN",
    category: "SQL Database Troubleshooting",
    reportedBy: "Jason Cruz (Front-End Lead)",
    affectedHost: "SRV-201-DB (192.168.2.5)",
    affectedService: "SQLite WAL Transaction Engine / SystemLocks Table",
    businessImpact: "Cashiers at all 12 registers cannot tender sales (SQLITE_BUSY error). Checkout queues extending across aisles. Revenue loss > $18,000/hr.",
    l1TriageNotes: "L1 verified server is powered on and CPU is at 4%. Cashiers restarted POS UI software, but issue persists on basket tender.",
    timeline: [
      "02:41:00 AM - EOD inventory stock reconciliation cron job (PID 8812) acquired EXCLUSIVE lock on 'Orders'.",
      "02:41:05 AM - Worker process crashed abnormally (SIGSEGV) without executing lock release cleanup.",
      "02:42:10 AM - Cashiers at Registers 1-12 report spinning wheels on basket tender; error SQLITE_BUSY (5).",
      "02:45:00 AM - Store Supervisor escalated to L2 NOC Helpdesk as P1 Critical Revenue Blocker."
    ],
    incidentNarrative: "A crashed nightly inventory process left an orphaned exclusive lock record in the 'SystemLocks' table for table_name 'Orders'. Because SQLite in-store database relies on cooperative locking, all 12 cashier terminals are blocked with SQLITE_BUSY (5) error on INSERT. Checkout lines are backing up during store trading.",
    incidentObjective: "Write a SQL DELETE query to remove the orphaned lock from 'SystemLocks' where table_name = 'Orders' and lock_type = 'EXCLUSIVE'.",
    starterCode: `-- Write a SQL DELETE statement to release the orphaned exclusive lock on 'Orders'
DELETE FROM SystemLocks
WHERE ...;`,
    expectedSolution: `DELETE FROM SystemLocks WHERE table_name = 'Orders' AND lock_type = 'EXCLUSIVE';`,
    validationKeywords: ["delete", "from", "systemlocks", "where", "orders"],
    validationRegex: [/delete\s+from\s+systemlocks/i, /table_name\s*=\s*['"]Orders['"]/i],
    verificationExplanation: "Deleting the orphaned EXCLUSIVE lock record from SystemLocks immediately releases the table mutex, allowing POS lanes 1 through 12 to resume checkout write operations without restart.",
    hints: [
      "Target table: SystemLocks",
      "Condition: table_name = 'Orders' AND lock_type = 'EXCLUSIVE'",
      "Always inspect with SELECT before running DELETE"
    ],
    diagnosticChecks: [
      {
        id: "check_locks",
        name: "Inspect Active Locks in SystemLocks Table",
        command: "SELECT lock_id, table_name, lock_type, acquired_by_pid, created_at FROM SystemLocks;",
        status: "FAILED",
        output: "LockID: LCK-8812 | Table: Orders | Type: EXCLUSIVE | PID: 8812 (DEAD / ZOMBIE) | Age: 42 mins."
      }
    ],
    terminalLogs: `[2026-09-30 02:41:05.890] [ERROR] [Worker-PID-8812] Process terminated abnormally (SIGSEGV).
[2026-09-30 02:41:10.005] [ERROR] [POS-Lanes] SQLITE_BUSY: Table 'Orders' locked by LockID LCK-8812.
[2026-09-30 02:41:15.000] [CRITICAL] [NOC] 12 registers unable to save completed baskets. ERR_DB_LOCK.`
  },
  {
    id: "INC-10582",
    envType: "sql",
    storeId: "Store 501 - Pasig Mega Mart",
    storeName: "SSEQUEL Mart #501",
    city: "Pasig City",
    terminalId: "SRV-501-SYNC",
    terminalModel: "Store Server Pro",
    title: "Repair Corrupted Terminal Offline Flag for Store 501 Registers",
    severity: "High",
    slaMinutes: 25,
    openedAt: "12 mins ago",
    status: "OPEN",
    category: "SQL Database Troubleshooting",
    reportedBy: "District Ops Tech",
    affectedHost: "SRV-501-SYNC (192.168.5.1)",
    affectedService: "Fleet Topology Router / Terminals Registry Table",
    businessImpact: "Terminals REG-501-01 and REG-501-02 are rejecting customer transactions because the central router believes they are offline. Store operating at 50% capacity.",
    l1TriageNotes: "L1 verified physical terminals are powered on and pingable. Issue is an out-of-sync database flag in the server's 'Terminals' table.",
    timeline: [
      "02:00:00 AM - Scheduled network switch maintenance caused a brief 30-second ARP re-convergence.",
      "02:00:11 AM - Fleet monitor marked REG-501-01 and REG-501-02 as 'OFFLINE' in the database.",
      "02:02:00 AM - Network restored, but automated heartbeat reconciliation missed these two records.",
      "02:15:00 AM - Cashiers unable to log in; POS UI shows 'Terminal disabled by Fleet Controller'."
    ],
    incidentNarrative: "Terminals REG-501-01 and REG-501-02 were marked as 'OFFLINE' in the 'Terminals' table during a scheduled router switch failover. Although the hardware is fully operational and healthy, the backend transaction router refuses to route orders to terminals marked OFFLINE in the database registry.",
    incidentObjective: "Write a SQL query to UPDATE the 'Terminals' table, setting 'status' = 'ONLINE' for terminals belonging to store_id = 501 where status is currently 'OFFLINE'.",
    starterCode: `-- Update the Terminals table to restore status to 'ONLINE' for Store 501
UPDATE Terminals
SET status = 'ONLINE'
WHERE ...;`,
    expectedSolution: `UPDATE Terminals SET status = 'ONLINE' WHERE store_id = 501 AND status = 'OFFLINE';`,
    validationKeywords: ["update", "terminals", "set", "status", "online", "501"],
    validationRegex: [/update\s+terminals\s+set\s+status\s*=\s*['"]ONLINE['"]/i, /(store_id\s*=\s*501|501)/i],
    verificationExplanation: "Updating Terminals table status to 'ONLINE' for store_id 501 allows the front-end transaction routing balancer to start directing checkout customer traffic to registers 1 and 2.",
    hints: [
      "Table: Terminals",
      "Set: status = 'ONLINE'",
      "Filter: store_id = 501 AND status = 'OFFLINE'"
    ],
    diagnosticChecks: [
      {
        id: "check_terminals_status",
        name: "Query Terminals Status in Store 501",
        command: "SELECT terminal_id, store_id, model, status, last_ping FROM Terminals WHERE store_id = 501;",
        status: "WARN",
        output: "REG-501-01: OFFLINE | REG-501-02: OFFLINE | REG-501-03: ONLINE | REG-501-04: ONLINE."
      }
    ],
    terminalLogs: `[2026-09-30 02:00:10.890] [INFO] [FleetMonitor] Checking active terminal registry...
[2026-09-30 02:00:11.120] [WARN] [Router] 2 registers marked OFFLINE in local database registry.
[2026-09-30 02:05:00.000] [ERROR] [POS-Router] Rejecting incoming basket: REG-501-01 status is OFFLINE.`
  },

  // =========================================================================
  // POWERSHELL TROUBLESHOOTING INCIDENTS
  // =========================================================================
  {
    id: "INC-10518",
    envType: "powershell",
    storeId: "Store 104 - Makati Central",
    storeName: "SSEQUEL Hypermarket #104",
    city: "Makati City",
    terminalId: "REG-104-03",
    terminalModel: "Epson TM-T88VI / NCR POS",
    title: "Restart Stopped Windows Print Spooler Service on Register 3",
    severity: "Medium",
    slaMinutes: 30,
    openedAt: "10 mins ago",
    status: "OPEN",
    category: "PowerShell System & Service Automation",
    reportedBy: "Carlo D. (Cashier Lane 3)",
    affectedHost: "REG-104-03 (Windows 10 IoT Enterprise)",
    affectedService: "Windows Print Spooler Service (spoolsv.exe / Spooler)",
    businessImpact: "Lane 3 cannot print customer receipts or tender slips. Cashiers are having to void orders and move customers to Lane 4, causing 15-minute checkout delays.",
    l1TriageNotes: "L1 tried turning the physical printer off and on. Printer power LED is green and paper feed test prints OK, but Windows OS reports service stopped.",
    timeline: [
      "02:28:10 AM - Cashier attempted printing a 48-item end-of-shift reconciliation report.",
      "02:30:16 AM - Windows spooler process encountered an unhandled RPC exception (0x800706BA).",
      "02:30:17 AM - Service Control Manager (SCM) marked 'Spooler' as Stopped.",
      "02:35:00 AM - Cashier reported error ERR_PRINTER_OFFLINE to Store Lead, escalated to L2."
    ],
    incidentNarrative: "On Register 3 (REG-104-03), the Windows Print Spooler service ('Spooler') crashed and terminated due to an RPC communication timeout when processing a bulk print job. Because the service is stopped, the POS application cannot send receipt rendering jobs to the local Epson TM-T88VI driver.",
    incidentObjective: "Execute the PowerShell cmdlet to restart the Windows Print Spooler service (Name: 'Spooler') with the -Force parameter.",
    starterCode: `# Write the PowerShell cmdlet to restart the Spooler service
Restart-Service -Name "Spooler" -Force`,
    expectedSolution: `Restart-Service -Name "Spooler" -Force`,
    validationKeywords: ["restart-service", "spooler"],
    validationRegex: [/restart-service\s+(-name\s+)?['"]?spooler['"]?/i],
    verificationExplanation: "Executing 'Restart-Service -Name Spooler -Force' purges the hung RPC thread handle in spoolsv.exe, restarts the background printer subsystem, and allows Epson TM-T88VI to resume printing receipts.",
    hints: [
      "Cmdlet: Restart-Service",
      "Service Name: 'Spooler' or Spooler",
      "Add flag: -Force"
    ],
    diagnosticChecks: [
      {
        id: "check_spooler_svc",
        name: "Check Windows Print Spooler Service Status",
        command: "Get-Service -Name Spooler",
        status: "FAILED",
        output: "Status: Stopped | Name: Spooler | DisplayName: Print Spooler | StartType: Automatic."
      }
    ],
    terminalLogs: `[2026-09-30 02:30:16.120] [WARN] [Spooler-Win32] Spooler RPC communication timeout. Error: 0x800706BA.
[2026-09-30 02:30:16.128] [ERROR] [POS-Core] Device status: OFFLINE. Code: ERR_PRINTER_OFFLINE.
[2026-09-30 02:30:17.001] [CRITICAL] [SCM] Service 'Spooler' entered the STOPPED state unexpectedly.`
  },
  {
    id: "INC-10640",
    envType: "powershell",
    storeId: "Store 302 - BGC Central",
    storeName: "SSEQUEL Department #302",
    city: "Taguig City",
    terminalId: "REG-302-01",
    terminalModel: "NCR RealPOS 70 (Win10 IoT)",
    title: "Force Terminate Stuck Payment Gateway Process and Relaunch Daemon",
    severity: "Critical",
    slaMinutes: 15,
    openedAt: "3 mins ago",
    status: "OPEN",
    category: "PowerShell System & Service Automation",
    reportedBy: "Grace Tan (Supervisor)",
    affectedHost: "REG-302-01 (192.168.3.11)",
    affectedService: "EFT Gateway Daemon / pos_eft_daemon.exe (PID 4892)",
    businessImpact: "Primary checkout terminal frozen at 'Authorizing Pinpad...' step. Card reader cannot initialize new sessions. Customer line halted.",
    l1TriageNotes: "L1 tried clicking 'Cancel' on the POS screen, but application is unresponsive due to socket lock held by pos_eft_daemon.",
    timeline: [
      "02:54:10 AM - Customer tapped contactless Visa card during an unstable TLS handshake.",
      "02:55:04 AM - Daemon entered an uninterruptible deadlocked socket state holding port 5672.",
      "02:55:05 AM - Watchdog sent SIGTERM, but process failed to terminate gracefully.",
      "02:56:00 AM - Cashier escalated P1 Critical ticket to L2 Support."
    ],
    incidentNarrative: "The local payment client process 'pos_eft_daemon.exe' has frozen in an uninterruptible deadlock state, consuming 99.8% CPU on Core 0 and locking TCP socket port 5672. The POS application watchdog cannot start a fresh daemon instance until this hung process PID is forcibly terminated.",
    incidentObjective: "Write a PowerShell command using 'Stop-Process' to forcibly kill the process named 'pos_eft_daemon' with the -Force parameter.",
    starterCode: `# Write the PowerShell command to terminate the hung pos_eft_daemon process
Stop-Process -Name "pos_eft_daemon" -Force`,
    expectedSolution: `Stop-Process -Name "pos_eft_daemon" -Force`,
    validationKeywords: ["stop-process", "pos_eft_daemon"],
    validationRegex: [/stop-process\s+(-name\s+)?['"]?pos_eft_daemon['"]?/i],
    verificationExplanation: "Executing 'Stop-Process -Name pos_eft_daemon -Force' frees the locked socket handle on TCP port 5672, allowing the watchdog manager to auto-respawn a clean EFT worker instance.",
    hints: [
      "Cmdlet: Stop-Process",
      "Name: 'pos_eft_daemon'",
      "Add parameter: -Force"
    ],
    diagnosticChecks: [
      {
        id: "check_proc",
        name: "Check Process State for pos_eft_daemon",
        command: "Get-Process -Name pos_eft_daemon | Select Id, ProcessName, Responding, CPU",
        status: "FAILED",
        output: "Id: 4892 | ProcessName: pos_eft_daemon | Responding: False (DEADLOCK) | CPU: 99.8%."
      }
    ],
    terminalLogs: `[2026-09-30 02:55:04.300] [CRITICAL] [EFT-Core] Thread lockup detected in pos_eft_daemon.exe (PID 4892).
[2026-09-30 02:55:05.100] [ERROR] [Watchdog] Process not responding to SIGTERM. Forced kill required.
[2026-09-30 02:55:10.000] [ERROR] [PortManager] Socket 0.0.0.0:5672 remains locked by PID 4892.`
  },
  {
    id: "INC-10677",
    envType: "powershell",
    storeId: "Store 415 - Cebu Seaside",
    storeName: "SSEQUEL Seaside #415",
    city: "Cebu City",
    terminalId: "REG-415-02",
    terminalModel: "Honeywell Scanner & Win10 Terminal",
    title: "Purge Orphaned Temporary Print Buffer Files (.SPL & .SHD)",
    severity: "Medium",
    slaMinutes: 30,
    openedAt: "6 mins ago",
    status: "OPEN",
    category: "PowerShell System & Service Automation",
    reportedBy: "Karen Cruz (Lead Cashier)",
    affectedHost: "REG-415-02 (Windows 10 Enterprise)",
    affectedService: "C:\\Windows\\System32\\spool\\PRINTERS Spool Queue Directory",
    businessImpact: "Thermal printer prints gibberish binary characters continuously and jams the paper roll, preventing legitimate customer receipts from printing.",
    l1TriageNotes: "L1 restarted printer and spooler service, but the moment the spooler starts, it re-reads corrupted .SHD shadow files and resumes printing garbage.",
    timeline: [
      "02:57:00 AM - Cashier power-cycled register in the middle of printing an uncompressed graphics logo.",
      "02:58:12 AM - Partial shadow files (00012.SHD / 00012.SPL) were written to disk with corrupted EOF markers.",
      "02:59:00 AM - Spooler endlessly loops over corrupted buffer, dumping raw ASCII escape sequences.",
      "03:00:00 AM - Escalated to L2 to purge the spool directory."
    ],
    incidentNarrative: "Corrupted temporary spool files in 'C:\\Windows\\System32\\spool\\PRINTERS' are poisoning the Windows print queue. Whenever the printer service starts, it attempts to parse the corrupted .SHD/.SPL binary buffer and crashes or feeds corrupt raw characters. The entire directory buffer must be purged.",
    incidentObjective: "Write a PowerShell command using 'Remove-Item' to delete all files in 'C:\\Windows\\System32\\spool\\PRINTERS\\*.*' with the -Force parameter.",
    starterCode: `# Write a PowerShell cmdlet to remove corrupt spool buffer files
Remove-Item -Path "C:\\Windows\\System32\\spool\\PRINTERS\\*.*" -Force`,
    expectedSolution: `Remove-Item -Path "C:\\Windows\\System32\\spool\\PRINTERS\\*.*" -Force`,
    validationKeywords: ["remove-item", "printers"],
    validationRegex: [/remove-item\s+(-path\s+)?['"]?.*printers.*['"]?/i],
    verificationExplanation: "Executing 'Remove-Item C:\\Windows\\System32\\spool\\PRINTERS\\*.* -Force' purges locked .SHD shadow headers and corrupt .SPL raw spool files, resetting the queue to 0 pending jobs.",
    hints: [
      "Cmdlet: Remove-Item",
      "Path: C:\\Windows\\System32\\spool\\PRINTERS\\*.*",
      "Add flag: -Force"
    ],
    diagnosticChecks: [
      {
        id: "check_spool_dir",
        name: "List Files in Spool Directory",
        command: "Get-ChildItem 'C:\\Windows\\System32\\spool\\PRINTERS'",
        status: "WARN",
        output: "Found 4 corrupted .SHD and .SPL files: 00012.SHD, 00012.SPL, 00013.SHD, 00013.SPL (Total: 8.4MB)."
      }
    ],
    terminalLogs: `[2026-09-30 02:58:12.460] [ERROR] [Spooler] Corrupt spool file 00012.SHD cannot be deserialized.
[2026-09-30 02:58:12.470] [WARN] [L2-Ops] Action Required: Purge PRINTERS spool folder using Remove-Item.
[2026-09-30 02:58:15.002] [ERROR] [PrintDriver] Deserialization failure: buffer length mismatch.`
  },
  {
    id: "INC-10712",
    envType: "sql",
    storeId: "Store 101 - Manila Flagship",
    storeName: "SSEQUEL Flagship #101",
    city: "Manila",
    terminalId: "SRV-101-LOYALTY",
    terminalModel: "Customer Loyalty SQL Database",
    title: "Repair Corrupted Member Loyalty Balance in Customers Table",
    severity: "Medium",
    slaMinutes: 30,
    openedAt: "5 mins ago",
    status: "OPEN",
    category: "SQL Database Troubleshooting",
    reportedBy: "Store Member Service Lead",
    affectedHost: "SRV-101-LOYALTY (192.168.1.15)",
    affectedService: "Customer Rewards Ledger / Customers Table",
    businessImpact: "VIP Customer (ID 104) at customer service desk demanding point balance correction for a $500 purchase. Customer satisfaction and loyalty retention risk.",
    l1TriageNotes: "L1 verified the order receipt shows $500 spent with loyalty barcode scanned, but Customers table still shows 0 points.",
    timeline: [
      "03:02:10 AM - Customer Elena Gomez purchased items totaling $500.00 at Register 2.",
      "03:05:10 AM - Database connection timed out during the second stage of the point accrual commit.",
      "03:06:00 AM - Customer checked mobile app; loyalty_points balance displayed 0 instead of 500.",
      "03:07:00 AM - Customer Service escalated ticket to L2 database support."
    ],
    incidentNarrative: "A VIP customer (customer_id = 104) made a $500 purchase, but a database lock contention timeout during payment settlement aborted the loyalty points accrual sub-transaction, leaving their 'loyalty_points' balance at 0. L2 Support must execute a direct SQL update to correct the ledger balance.",
    incidentObjective: "Write a SQL UPDATE query to set 'loyalty_points' = 500 in the 'Customers' table for 'customer_id' = 104.",
    starterCode: `-- Update the Customers table to adjust loyalty points balance for customer 104
UPDATE Customers
SET loyalty_points = 500
WHERE ...;`,
    expectedSolution: `UPDATE Customers SET loyalty_points = 500 WHERE customer_id = 104;`,
    validationKeywords: ["update", "customers", "set", "loyalty_points", "500", "104"],
    validationRegex: [/update\s+customers\s+set\s+loyalty_points\s*=\s*500/i, /customer_id\s*=\s*104/i],
    verificationExplanation: "Executing UPDATE Customers SET loyalty_points = 500 WHERE customer_id = 104 restores the customer's missing rewards balance and recalculates their VIP tier status.",
    hints: [
      "Target table: Customers",
      "Set column: loyalty_points = 500",
      "Condition: customer_id = 104"
    ],
    diagnosticChecks: [
      {
        id: "check_cust_points",
        name: "Query Customer 104 Profile and Points",
        command: "SELECT customer_id, first_name, last_name, loyalty_points, tier FROM Customers WHERE customer_id = 104;",
        status: "WARN",
        output: "CustomerID: 104 | Name: Elena Gomez | LoyaltyPoints: 0 (DISCREPANCY - Expected: 500)."
      }
    ],
    terminalLogs: `[2026-09-30 03:05:10.120] [WARN] [Loyalty-Engine] Point accrual transaction timed out during commit.
[2026-09-30 03:05:10.130] [INFO] [L2-Ops] Action Required: Execute SQL UPDATE to restore 500 loyalty points for customer_id 104.`
  },
  {
    id: "INC-10745",
    envType: "sql",
    storeId: "Store 308 - BGC High Street",
    storeName: "SSEQUEL Express #308",
    city: "Taguig City",
    terminalId: "SRV-308-AUTH",
    terminalModel: "In-Store Auth Session DB",
    title: "Purge Stale Expired Cashier Session Tokens from AuthSessions Table",
    severity: "Low",
    slaMinutes: 45,
    openedAt: "15 mins ago",
    status: "OPEN",
    category: "SQL Database Troubleshooting",
    reportedBy: "Store Shift Manager",
    affectedHost: "SRV-308-AUTH (192.168.3.20)",
    affectedService: "Cashier Authentication Service / AuthSessions Table",
    businessImpact: "Cashier biometric and PIN logins taking 8 to 12 seconds instead of < 1s. Morning shift lane opening delayed.",
    l1TriageNotes: "L1 verified network latency is < 1ms. Database CPU is normal, but AuthSessions table has ballooned in row count.",
    timeline: [
      "02:00:00 AM - Weekly automated session purge maintenance cron failed to execute due to permission misconfiguration.",
      "03:00:00 AM - Over 512 stale expired cashier tokens remain in the AuthSessions table.",
      "03:10:00 AM - Morning cashier logins experience full table scan index latency.",
      "03:12:00 AM - Shift Manager reported login slowness to L2 Helpdesk."
    ],
    incidentNarrative: "Over 500 expired cashier login sessions from last week are clogging the 'AuthSessions' table due to a failed maintenance cron job. The unindexed query path causes cashier fingerprint and PIN authentications to experience unacceptable latency.",
    incidentObjective: "Write a SQL DELETE query to remove all records from the 'AuthSessions' table where 'session_status' = 'EXPIRED'.",
    starterCode: `-- Write a SQL query to purge expired login sessions
DELETE FROM AuthSessions
WHERE ...;`,
    expectedSolution: `DELETE FROM AuthSessions WHERE session_status = 'EXPIRED';`,
    validationKeywords: ["delete", "from", "authsessions", "where", "expired"],
    validationRegex: [/delete\s+from\s+authsessions/i, /session_status\s*=\s*['"]EXPIRED['"]/i],
    verificationExplanation: "Executing DELETE FROM AuthSessions WHERE session_status = 'EXPIRED' purges 500+ stale session tokens, reclaiming B-Tree index space and accelerating cashier logins.",
    hints: [
      "Table: AuthSessions",
      "Condition: session_status = 'EXPIRED'"
    ],
    diagnosticChecks: [
      {
        id: "check_expired_sessions",
        name: "Count Expired Sessions in AuthSessions Table",
        command: "SELECT session_status, COUNT(*) AS count FROM AuthSessions GROUP BY session_status;",
        status: "WARN",
        output: "ACTIVE: 8 sessions | EXPIRED: 512 stale sessions."
      }
    ],
    terminalLogs: `[2026-09-30 03:10:00.005] [WARN] [Auth-Service] AuthSessions table size exceeds threshold (520 rows). High index scan latency.
[2026-09-30 03:10:02.120] [INFO] [Auth-Service] Average login query time: 8,420ms (Threshold: 500ms).`
  },
  {
    id: "INC-10780",
    envType: "powershell",
    storeId: "Store 204 - QC North Mall",
    storeName: "SSEQUEL Department #204",
    city: "Quezon City",
    terminalId: "SRV-204-AMQP",
    terminalModel: "Windows Server 2022 / AMQP Bridge",
    title: "Restart Frozen RabbitMQ Enterprise Transaction Sync Client Service",
    severity: "High",
    slaMinutes: 25,
    openedAt: "8 mins ago",
    status: "OPEN",
    category: "PowerShell System & Service Automation",
    reportedBy: "CloudHQ Sync Telemetry",
    affectedHost: "SRV-204-AMQP (192.168.2.100)",
    affectedService: "RabbitMQ Transaction Sync Service (RabbitMQ_Sync)",
    businessImpact: "Live store sales data is not streaming to central cloud dashboards. Inventory re-ordering and financial consolidation pipeline delayed by 45 minutes.",
    l1TriageNotes: "L1 confirmed TCP port 5672 is reachable to the CloudHQ cluster, but local service is in a hung 'Paused / Socket Wait' state.",
    timeline: [
      "03:10:00 AM - CloudHQ AMQP broker performed rolling certificate refresh.",
      "03:15:20 AM - Local client service failed to renegotiate SSL heartbeat and entered infinite socket wait.",
      "03:16:00 AM - Outbox messages queued locally (320 messages waiting).",
      "03:18:00 AM - Telemetry bot generated P2 escalation to L2 NOC."
    ],
    incidentNarrative: "The background transaction synchronization service 'RabbitMQ_Sync' has hung in a socket wait state following a TLS heartbeat miss. The service status reports as Paused/Unresponsive, preventing 320 pending store transactions from transmitting to the central cloud enterprise ERP.",
    incidentObjective: "Execute a PowerShell cmdlet to restart the service named 'RabbitMQ_Sync' with the -Force parameter.",
    starterCode: `# Write the PowerShell cmdlet to restart the RabbitMQ_Sync service
Restart-Service -Name "RabbitMQ_Sync" -Force`,
    expectedSolution: `Restart-Service -Name "RabbitMQ_Sync" -Force`,
    validationKeywords: ["restart-service", "rabbitmq_sync"],
    validationRegex: [/restart-service\s+(-name\s+)?['"]?rabbitmq_sync['"]?/i],
    verificationExplanation: "Executing 'Restart-Service -Name RabbitMQ_Sync -Force' tears down the stuck AMQP socket and restarts message polling, immediately resuming transaction streaming to CloudHQ.",
    hints: [
      "Cmdlet: Restart-Service",
      "Service Name: 'RabbitMQ_Sync'",
      "Parameter: -Force"
    ],
    diagnosticChecks: [
      {
        id: "check_amqp_svc",
        name: "Inspect Status of RabbitMQ_Sync Service",
        command: "Get-Service -Name RabbitMQ_Sync",
        status: "WARN",
        output: "Status: Paused / Unresponsive | ServiceName: RabbitMQ_Sync | DisplayName: RabbitMQ Sync Client."
      }
    ],
    terminalLogs: `[2026-09-30 03:15:20.100] [ERROR] [AMQP-Client] Socket heartbeat missed (120s timeout). Service frozen.
[2026-09-30 03:15:25.000] [WARN] [BufferManager] 320 outbound messages currently queued in memory.`
  },
  {
    id: "INC-10815",
    envType: "powershell",
    storeId: "Store 518 - Davao Central",
    storeName: "SSEQUEL Hypermarket #518",
    city: "Davao City",
    terminalId: "REG-518-01",
    terminalModel: "Win10 IoT Enterprise Controller",
    title: "Terminate Runaway Catalog Indexer Memory Leak Process",
    severity: "High",
    slaMinutes: 20,
    openedAt: "4 mins ago",
    status: "OPEN",
    category: "PowerShell System & Service Automation",
    reportedBy: "Davao Shift Lead",
    affectedHost: "REG-518-01 (192.168.5.12)",
    affectedService: "Local Catalog Indexer Daemon / catalog_indexer.exe (PID 9140)",
    businessImpact: "Cashier UI experiencing 4-second stutter on every barcode scan. System memory pressure is at 98%, risking OS kernel crash during trading.",
    l1TriageNotes: "L1 verified total RAM is 4GB, with 3.8GB consumed by catalog_indexer.exe alone.",
    timeline: [
      "03:18:00 AM - Catalog indexing worker started processing updated product promotion price book.",
      "03:19:30 AM - Regex backtracking bug in description parser triggered an unbounded memory allocation loop.",
      "03:20:00 AM - Process consumed 3.8GB RAM; Windows OS watchdog triggered memory pressure warning.",
      "03:21:00 AM - Cashier escalated to L2 as critical POS UI lag."
    ],
    incidentNarrative: "A background search indexing process 'catalog_indexer.exe' (PID 9140) has suffered a catastrophic memory leak due to a regex parser bug, consuming 3.8GB of the terminal's 4GB RAM. The resulting page-swapping has caused the cashier checkout interface to stutter severely.",
    incidentObjective: "Write a PowerShell command using 'Stop-Process' to terminate the process named 'catalog_indexer' with the -Force flag.",
    starterCode: `# Write the PowerShell command to kill the runaway catalog_indexer process
Stop-Process -Name "catalog_indexer" -Force`,
    expectedSolution: `Stop-Process -Name "catalog_indexer" -Force`,
    validationKeywords: ["stop-process", "catalog_indexer"],
    validationRegex: [/stop-process\s+(-name\s+)?['"]?catalog_indexer['"]?/i],
    verificationExplanation: "Executing 'Stop-Process -Name catalog_indexer -Force' terminates the memory-leaking catalog indexer worker and reclaims 3.8GB of system RAM, immediately restoring smooth POS UI response times.",
    hints: [
      "Cmdlet: Stop-Process",
      "Name: 'catalog_indexer'",
      "Parameter: -Force"
    ],
    diagnosticChecks: [
      {
        id: "check_memory_proc",
        name: "Inspect Top Memory Processes",
        command: "Get-Process -Name catalog_indexer | Select Id, WorkingSet64, CPU",
        status: "FAILED",
        output: "Id: 9140 | ProcessName: catalog_indexer | WorkingSet: 3,942,100 KB (3.8 GB) | Status: RUNAWAY LEAK."
      }
    ],
    terminalLogs: `[2026-09-30 03:20:00.890] [CRITICAL] [OS-Watchdog] Memory pressure critical: available RAM < 120MB.
[2026-09-30 03:20:01.120] [WARN] [POS-Shell] UI render thread delayed by 4,120ms (PageFault thrashing).`
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
  const laneNum = Math.floor(1 + Math.random() * 8);

  return {
    ...template,
    id: `INC-${randomNum}`,
    storeId: store.storeId,
    storeName: store.storeName,
    city: store.city,
    terminalId: template.envType === 'sql' ? `SRV-${randomNum.toString().slice(-3)}-DB` : `REG-${randomNum.toString().slice(-3)}-0${laneNum}`,
    openedAt: "Just now (Live Escalation)",
    status: "OPEN",
    remainingSeconds: template.slaMinutes * 60,
    slaBreached: false,
    runDiagnostics: [],
    userCode: template.starterCode || '',
    executionResult: null
  };
}
