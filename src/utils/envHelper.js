/**
 * Environment detection and configurations for Multi-Discipline IT Support Assessments:
 * - SQL (Relational Database queries via AlaSQL)
 * - PowerShell (Windows Automation & Service Management)
 * - Network Troubleshooting (ICMP, TCP Ports, DNS, Gateway Connectivity)
 */

export function getQuestionEnv(question) {
  if (!question) return 'sql';

  // Explicit envType field
  if (question.envType) {
    const norm = String(question.envType).toLowerCase().trim();
    if (norm === 'powershell' || norm === 'ps' || norm === 'shell') return 'powershell';
    if (norm === 'network' || norm === 'networking' || norm === 'net') return 'network';
    if (norm === 'sql') return 'sql';
  }

  // Category or Topic field inspection
  const category = (question.category || question.topic || '').toLowerCase();
  if (category.includes('power') || category.includes('ps') || category.includes('cmdlet')) {
    return 'powershell';
  }
  if (category.includes('net') || category.includes('ping') || category.includes('dns') || category.includes('ip') || category.includes('port')) {
    return 'network';
  }

  // Tags or prompt detection
  const tagsStr = Array.isArray(question.tags) ? question.tags.join(' ').toLowerCase() : '';
  if (tagsStr.includes('powershell') || tagsStr.includes('cmdlet')) return 'powershell';
  if (tagsStr.includes('network') || tagsStr.includes('icmp') || tagsStr.includes('tcp') || tagsStr.includes('ping')) return 'network';

  const promptLower = (question.prompt || '').toLowerCase();
  if (promptLower.includes('powershell') || promptLower.includes('restart-service') || promptLower.includes('get-service')) {
    return 'powershell';
  }
  if (promptLower.includes('ping') || promptLower.includes('traceroute') || promptLower.includes('test-netconnection') || promptLower.includes('ipconfig')) {
    return 'network';
  }

  return 'sql';
}

export const ENV_CONFIGS = {
  sql: {
    id: 'sql',
    label: 'SQL Database',
    badge: 'AlaSQL Dialect',
    editorTitle: 'SQL Query Editor',
    commentPrefix: '--',
    placeholder: '-- Write your SQL query here...\nSELECT store_id, store_name, city, server_status\nFROM Stores\nWHERE server_status = \'OFFLINE\';',
    snippets: ['SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'COUNT(*)'],
    actionButtonText: 'Check Query Answer',
    iconType: 'database',
    emptyMessage: 'Enter a SQL query and press Run to execute against the in-memory store database.',
    terminalPrompt: 'mysql> '
  },
  powershell: {
    id: 'powershell',
    label: 'PowerShell Automation',
    badge: 'PowerShell 7.4 (x64)',
    editorTitle: 'PowerShell CLI Console',
    commentPrefix: '#',
    placeholder: '# Write your PowerShell command / cmdlet here...\nRestart-Service -Name W3SVC -Force\nGet-Service -Name "POS*"\nTest-NetConnection -ComputerName 10.101.0.1 -Port 8080',
    snippets: ['Get-Service', 'Restart-Service -Force', 'Test-NetConnection -Port', 'Get-WinEvent', 'Stop-Process -Force', 'Get-Process', 'Test-Path'],
    actionButtonText: 'Run PowerShell Cmdlet',
    iconType: 'terminal',
    emptyMessage: 'Enter a PowerShell cmdlet or automation script and press Run to execute in simulated terminal.',
    terminalPrompt: 'PS C:\\POS\\Support\\Diagnostics> '
  },
  network: {
    id: 'network',
    label: 'Network Troubleshooting',
    badge: 'ICMP / TCP Diagnostics',
    editorTitle: 'Network Diagnostic Terminal',
    commentPrefix: '#',
    placeholder: '# Write your network diagnostic command here...\nping -n 4 10.101.0.1\ntracert 192.168.1.254\nTest-NetConnection -ComputerName 10.101.0.5 -Port 8080\nnslookup pos-gateway.corp.local',
    snippets: ['ping -n 4', 'tracert', 'nslookup', 'netstat -ano', 'Test-NetConnection -Port', 'ipconfig /all', 'curl -I'],
    actionButtonText: 'Run Network Diagnostic',
    iconType: 'network',
    emptyMessage: 'Enter a network diagnostic command (ping, tracert, nslookup, test-netconnection) and press Run.',
    terminalPrompt: 'pos-admin@edge-gw-01:~$ '
  }
};

/**
 * Generates realistic CLI output simulation for PowerShell and Network commands
 */
export function generateSimulatedCliOutput(envType, command, isCorrect, question) {
  const cleanCmd = (command || '').trim();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (envType === 'powershell') {
    if (cleanCmd.toLowerCase().includes('restart-service')) {
      return {
        exitCode: isCorrect ? 0 : 1,
        stdout: [
          `[${timestamp}] Initiating service restart sequence...`,
          `Service 'POS_Core_Service' was successfully stopped.`,
          `Waiting 500ms for thread lock releases...`,
          `Service 'POS_Core_Service' (POS Core Transaction Processing Engine) started with PID: 4892.`,
          `Health Check: HTTP 200 OK on http://127.0.0.1:8080/health`
        ],
        rawTelemetry: {
          Status: isCorrect ? 'Running' : 'Stopped',
          Name: 'POSCoreSvc',
          DisplayName: 'Point of Sale Transaction Daemon',
          CanStop: true,
          StartType: 'Automatic'
        }
      };
    }

    if (cleanCmd.toLowerCase().includes('get-service')) {
      return {
        exitCode: 0,
        stdout: [
          `Status   Name               DisplayName`,
          `------   ----               -----------`,
          `Running  POSCoreSvc         Point of Sale Transaction Daemon`,
          `Running  POSPrinterSpool    POS Thermal Receipt Spooler`,
          `Stopped  POSEFTBridge       Electronic Funds Transfer Link (Needs Restart)`,
          `Running  W3SVC              World Wide Web Publishing Service`
        ],
        rawTelemetry: {
          TotalServices: 4,
          Running: 3,
          Stopped: 1
        }
      };
    }

    if (cleanCmd.toLowerCase().includes('get-process') || cleanCmd.toLowerCase().includes('stop-process')) {
      return {
        exitCode: isCorrect ? 0 : 1,
        stdout: [
          `NPM(K)    PM(M)      WS(M)     CPU(s)     Id  SI ProcessName`,
          `------    -----      -----     ------     --  -- -----------`,
          `   124   184.20     210.50      84.12   4912   1 POSTerminalHost`,
          `    45    32.10      48.00       2.10   1024   1 POSScannerService`,
          `    88    95.40     112.30      14.50   2890   1 EdgePrinterDriver`
        ],
        rawTelemetry: { TargetPid: 4912, CpuUtilization: '84.12s', MemoryMB: '210.5 MB' }
      };
    }

    // Default PowerShell generic cmdlet response
    return {
      exitCode: isCorrect ? 0 : 1,
      stdout: isCorrect ? [
        `Command executed successfully with Return Code 0.`,
        `PowerShell Runtime: 7.4.1 [CoreCLR 8.0.2]`,
        `Telemetry: 1 object piped, pipeline completed without error records.`
      ] : [
        `ERROR: Command executed but yielded incomplete parameters.`,
        `Check target flags and incident specifications.`
      ],
      rawTelemetry: { ExecutionState: isCorrect ? 'SUCCESS' : 'FAILED', Command: cleanCmd }
    };
  }

  if (envType === 'network') {
    if (cleanCmd.toLowerCase().includes('ping')) {
      const targetHost = cleanCmd.split(' ').pop() || '10.101.0.1';
      return {
        exitCode: isCorrect ? 0 : 1,
        stdout: [
          `Pinging ${targetHost} with 32 bytes of data:`,
          `Reply from ${targetHost}: bytes=32 time=4ms TTL=128`,
          `Reply from ${targetHost}: bytes=32 time=3ms TTL=128`,
          `Reply from ${targetHost}: bytes=32 time=5ms TTL=128`,
          `Reply from ${targetHost}: bytes=32 time=4ms TTL=128`,
          ``,
          `Ping statistics for ${targetHost}:`,
          `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`,
          `Approximate round trip times in milli-seconds:`,
          `    Minimum = 3ms, Maximum = 5ms, Average = 4ms`
        ],
        rawTelemetry: { Host: targetHost, PacketLoss: '0%', AvgLatencyMs: 4, Status: 'REACHABLE' }
      };
    }

    if (cleanCmd.toLowerCase().includes('test-netconnection')) {
      return {
        exitCode: isCorrect ? 0 : 1,
        stdout: [
          `ComputerName           : 10.101.0.5`,
          `RemoteAddress          : 10.101.0.5`,
          `RemotePort             : 8080`,
          `InterfaceAlias         : Ethernet0`,
          `SourceAddress          : 10.101.0.24`,
          `PingSucceeded          : True`,
          `PingReplyDetails (RTT) : 3 ms`,
          `TcpTestSucceeded       : ${isCorrect ? 'True' : 'False'}`
        ],
        rawTelemetry: { TcpPort: 8080, TcpTestSucceeded: isCorrect, RoundTripMs: 3 }
      };
    }

    if (cleanCmd.toLowerCase().includes('tracert') || cleanCmd.toLowerCase().includes('traceroute')) {
      return {
        exitCode: 0,
        stdout: [
          `Tracing route to pos-edge-gateway.corp.local [10.101.0.1] over a maximum of 30 hops:`,
          `  1     1 ms     1 ms    <1 ms  192.168.1.1 (Store Lane Switch)`,
          `  2     2 ms     2 ms     2 ms  10.101.0.254 (VLAN 100 Gateway)`,
          `  3     3 ms     4 ms     3 ms  10.101.0.1 (POS Backoffice Host)`,
          `Trace complete.`
        ],
        rawTelemetry: { Hops: 3, DestinationReachable: true }
      };
    }

    // Default Network CLI response
    return {
      exitCode: isCorrect ? 0 : 1,
      stdout: isCorrect ? [
        `Diagnostic socket connection established to POS subnet.`,
        `Telemetry: 0 packet drops detected, interface duplex: FULL 1000Mbps.`,
        `Gateway route verified active.`
      ] : [
        `Diagnostic test completed with warnings. Target port or host unreachable.`
      ],
      rawTelemetry: { InterfaceState: 'UP', DiagnosticStatus: isCorrect ? 'RESOLVED' : 'INVESTIGATING' }
    };
  }

  return { exitCode: 0, stdout: [], rawTelemetry: {} };
}
