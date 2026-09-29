export const questionBank = [
  {
    "id": 1,
    "difficulty": "Basic",
    "tierIndex": 1,
    "ticketId": "INC-101",
    "title": "Offline Store Server Identification",
    "scenario": "The Enterprise Operations Center (NOC) reported potential network outages affecting retail outlets. You need to identify all store servers that are currently in an OFFLINE status so field support technicians can be dispatched.",
    "prompt": "Write a SQL query to select the store_id, store_name, city, and server_status from the Stores table where server_status is \"OFFLINE\".",
    "hint": "Use the WHERE clause to filter by server_status = 'OFFLINE'. Remember that text literals are enclosed in single quotes.",
    "tags": [
      "SELECT",
      "WHERE",
      "Stores"
    ],
    "starterCode": "-- Incident INC-101: Offline Store Server Identification\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, store_name, city, server_status FROM Stores WHERE server_status = 'OFFLINE';",
    "isStub": false,
    "simpleGoal": "Find all stores whose main computer server is currently disconnected (OFFLINE).",
    "simplePrompt": "From the Stores table, show the store_id, store_name, city, and server_status where server_status equals 'OFFLINE'.",
    "simpleSteps": [
      "Target Table: Stores",
      "Columns to pick: store_id, store_name, city, server_status",
      "Condition: WHERE server_status = 'OFFLINE'"
    ]
  },
  {
    "id": 2,
    "difficulty": "Basic",
    "tierIndex": 2,
    "ticketId": "INC-102",
    "title": "Failed Credit Card Transactions Audit",
    "scenario": "Accounting reported reconciliation discrepancies on credit tenders. An investigation is required to locate all transactions where payment failed using the CREDIT payment method.",
    "prompt": "Write a query to retrieve transaction_id, store_id, register_id, total_amount, and status from the Transactions table where status is \"FAILED\" and payment_method is \"CREDIT\".",
    "hint": "Combine two conditions in the WHERE clause using the AND operator: status = 'FAILED' AND payment_method = 'CREDIT'.",
    "tags": [
      "SELECT",
      "WHERE",
      "AND",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-102: Failed Credit Card Transactions Audit\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT transaction_id, store_id, register_id, total_amount, status FROM Transactions WHERE status = 'FAILED' AND payment_method = 'CREDIT';",
    "isStub": false,
    "simpleGoal": "Find any credit card payments that failed so we can check why customer cards were rejected.",
    "simplePrompt": "From the Transactions table, show transaction_id, store_id, register_id, total_amount, and status where status is 'FAILED' and payment_method is 'CREDIT'.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Columns to pick: transaction_id, store_id, register_id, total_amount, status",
      "Condition: WHERE status = 'FAILED' AND payment_method = 'CREDIT'"
    ]
  },
  {
    "id": 3,
    "difficulty": "Basic",
    "tierIndex": 3,
    "ticketId": "INC-103",
    "title": "Offline POS Register Lanes",
    "scenario": "Cashiers are reporting that several lane terminals have frozen or lost local network connectivity. You need to inspect the register fleet for disconnected terminals.",
    "prompt": "Write a query to select register_id, store_id, terminal_number, and model from the Registers table where is_online equals 0.",
    "hint": "Filter on the is_online column with is_online = 0.",
    "tags": [
      "SELECT",
      "WHERE",
      "Registers"
    ],
    "starterCode": "-- Incident INC-103: Offline POS Register Lanes\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT register_id, store_id, terminal_number, model FROM Registers WHERE is_online = 0;",
    "isStub": false,
    "simpleGoal": "Find all checkout register terminals that are currently turned off or disconnected.",
    "simplePrompt": "From the Registers table, show register_id, store_id, terminal_number, and model where is_online is 0.",
    "simpleSteps": [
      "Target Table: Registers",
      "Columns to pick: register_id, store_id, terminal_number, model",
      "Condition: WHERE is_online = 0"
    ]
  },
  {
    "id": 4,
    "difficulty": "Basic",
    "tierIndex": 4,
    "ticketId": "INC-104",
    "title": "Critical Severity POS System Error Logs",
    "scenario": "Store system crash logs need triaging. Find all incident records in the ErrorLogs table flagged as CRITICAL or FATAL severity so they can be escalated to L3 engineering.",
    "prompt": "Write a query to select log_id, store_id, error_code, severity, and error_message from ErrorLogs where severity is either \"CRITICAL\" or \"FATAL\".",
    "hint": "You can use the IN operator: severity IN ('CRITICAL', 'FATAL') or use OR.",
    "tags": [
      "SELECT",
      "WHERE",
      "IN",
      "ErrorLogs"
    ],
    "starterCode": "-- Incident INC-104: Critical Severity POS System Error Logs\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT log_id, store_id, error_code, severity, error_message FROM ErrorLogs WHERE severity IN ('CRITICAL', 'FATAL');",
    "isStub": false,
    "simpleGoal": "Find severe system error messages that are marked as either 'CRITICAL' or 'FATAL'.",
    "simplePrompt": "From the ErrorLogs table, show log_id, store_id, error_code, severity, and error_message for rows where severity is 'CRITICAL' or 'FATAL'.",
    "simpleSteps": [
      "Target Table: ErrorLogs",
      "Columns to pick: log_id, store_id, error_code, severity, error_message",
      "Condition: WHERE severity IN ('CRITICAL', 'FATAL')"
    ]
  },
  {
    "id": 5,
    "difficulty": "Basic",
    "tierIndex": 5,
    "ticketId": "INC-105",
    "title": "Cashier Transaction Audit Trail",
    "scenario": "An audit request has been raised to review all tenders processed by cashier CSH-401 due to an end-of-shift drawer count variation.",
    "prompt": "Write a query to retrieve all columns from Transactions for cashier_id = \"CSH-401\".",
    "hint": "Use SELECT * FROM Transactions WHERE cashier_id = 'CSH-401'.",
    "tags": [
      "SELECT",
      "WHERE",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-105: Cashier Transaction Audit Trail\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT * FROM Transactions WHERE cashier_id = 'CSH-401';",
    "isStub": false,
    "simpleGoal": "Look up every single transaction processed by cashier 'CSH-401'.",
    "simplePrompt": "From the Transactions table, select all columns (*) for cashier_id = 'CSH-401'.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Columns to pick: * (all columns)",
      "Condition: WHERE cashier_id = 'CSH-401'"
    ]
  },
  {
    "id": 6,
    "difficulty": "Basic",
    "tierIndex": 6,
    "ticketId": "INC-106",
    "title": "Regional Store Server Inventory",
    "scenario": "Network administration is rolling out a firewall patch specifically to Washington (WA) state stores. List all stores in that state.",
    "prompt": "Select store_id, store_name, city, and server_ip from Stores where state = \"WA\".",
    "hint": "Filter with WHERE state = 'WA'.",
    "tags": [
      "SELECT",
      "WHERE",
      "Stores"
    ],
    "starterCode": "-- Incident INC-106: Regional Store Server Inventory\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, store_name, city, server_ip FROM Stores WHERE state = 'WA';",
    "isStub": true,
    "simpleGoal": "List all stores located in the state of Washington ('WA').",
    "simplePrompt": "From the Stores table, show store_id, store_name, city, and server_ip where state is 'WA'.",
    "simpleSteps": [
      "Target Table: Stores",
      "Columns to pick: store_id, store_name, city, server_ip",
      "Condition: WHERE state = 'WA'"
    ]
  },
  {
    "id": 7,
    "difficulty": "Basic",
    "tierIndex": 7,
    "ticketId": "INC-107",
    "title": "High-Value POS Orders Triage",
    "scenario": "Fraud prevention monitors high-ticket orders exceeding $200 for fraud detection algorithms.",
    "prompt": "Write a query to select transaction_id, store_id, total_amount, and payment_method from Transactions where total_amount > 200.",
    "hint": "Use the greater-than operator (>) on total_amount.",
    "tags": [
      "SELECT",
      "WHERE",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-107: High-Value POS Orders Triage\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT transaction_id, store_id, total_amount, payment_method FROM Transactions WHERE total_amount > 200;",
    "isStub": true,
    "simpleGoal": "Find all large customer orders where the total bill is over $200.",
    "simplePrompt": "From the Transactions table, show transaction_id, store_id, total_amount, and payment_method where total_amount > 200.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Columns to pick: transaction_id, store_id, total_amount, payment_method",
      "Condition: WHERE total_amount > 200"
    ]
  },
  {
    "id": 8,
    "difficulty": "Basic",
    "tierIndex": 8,
    "ticketId": "INC-108",
    "title": "NCR RealPOS Hardware Fleet Lookup",
    "scenario": "A hardware vendor bulletin recommends a BIOS update for all NCR RealPOS 70 terminals.",
    "prompt": "Select register_id, store_id, terminal_number, and os_version from Registers where model = \"NCR RealPOS 70\".",
    "hint": "Filter on model with model = 'NCR RealPOS 70'.",
    "tags": [
      "SELECT",
      "WHERE",
      "Registers"
    ],
    "starterCode": "-- Incident INC-108: NCR RealPOS Hardware Fleet Lookup\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT register_id, store_id, terminal_number, os_version FROM Registers WHERE model = 'NCR RealPOS 70';",
    "isStub": true,
    "simpleGoal": "Find all register terminals that use the 'NCR RealPOS 70' hardware model.",
    "simplePrompt": "From the Registers table, show register_id, store_id, terminal_number, and os_version where model is 'NCR RealPOS 70'.",
    "simpleSteps": [
      "Target Table: Registers",
      "Columns to pick: register_id, store_id, terminal_number, os_version",
      "Condition: WHERE model = 'NCR RealPOS 70'"
    ]
  },
  {
    "id": 9,
    "difficulty": "Basic",
    "tierIndex": 9,
    "ticketId": "INC-109",
    "title": "Pending Sync Transaction Queue Check",
    "scenario": "During network degradation, POS terminals store sales locally in PENDING_SYNC status before batch upload.",
    "prompt": "Write a query to select transaction_id, register_id, store_id, and total_amount from Transactions where status = \"PENDING_SYNC\".",
    "hint": "Use WHERE status = 'PENDING_SYNC'.",
    "tags": [
      "SELECT",
      "WHERE",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-109: Pending Sync Transaction Queue Check\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT transaction_id, register_id, store_id, total_amount FROM Transactions WHERE status = 'PENDING_SYNC';",
    "isStub": true,
    "simpleGoal": "Find orders that are waiting to sync with the central server (PENDING_SYNC).",
    "simplePrompt": "From the Transactions table, show transaction_id, register_id, store_id, and total_amount where status is 'PENDING_SYNC'.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Columns to pick: transaction_id, register_id, store_id, total_amount",
      "Condition: WHERE status = 'PENDING_SYNC'"
    ]
  },
  {
    "id": 10,
    "difficulty": "Basic",
    "tierIndex": 10,
    "ticketId": "INC-110",
    "title": "Alphabetical Store Directory Listing",
    "scenario": "Generate an alphabetical roster of all stores for the field operations directory.",
    "prompt": "Select store_id, store_name, city, and state from Stores ordered by store_name in ascending order (ASC).",
    "hint": "Use ORDER BY store_name ASC at the end of the query.",
    "tags": [
      "SELECT",
      "ORDER BY",
      "Stores"
    ],
    "starterCode": "-- Incident INC-110: Alphabetical Store Directory Listing\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, store_name, city, state FROM Stores ORDER BY store_name ASC;",
    "isStub": true,
    "simpleGoal": "List all stores alphabetically by store name from A to Z.",
    "simplePrompt": "From the Stores table, show store_id, store_name, city, and state, ordered alphabetically by store_name.",
    "simpleSteps": [
      "Target Table: Stores",
      "Columns to pick: store_id, store_name, city, state",
      "Sort by: ORDER BY store_name ASC"
    ]
  },
  {
    "id": 11,
    "difficulty": "Medium",
    "tierIndex": 1,
    "ticketId": "INC-201",
    "title": "Store Revenue and Volume Aggregation",
    "scenario": "Store management requires a summary of total completed transaction count and gross revenue generated per store location.",
    "prompt": "Write a query to display store_id, COUNT(*) AS total_transactions, and SUM(total_amount) AS total_revenue from Transactions for completed sales (status = \"COMPLETED\"), grouped by store_id.",
    "hint": "Use WHERE status = 'COMPLETED' before the GROUP BY store_id clause, with aggregate functions COUNT(*) and SUM(total_amount).",
    "tags": [
      "GROUP BY",
      "COUNT",
      "SUM",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-201: Store Revenue and Volume Aggregation\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, COUNT(*) AS total_transactions, SUM(total_amount) AS total_revenue FROM Transactions WHERE status = 'COMPLETED' GROUP BY store_id;",
    "isStub": false,
    "simpleGoal": "Calculate the total number of successful sales and total money earned per store.",
    "simplePrompt": "From Transactions, group by store_id and calculate COUNT(*) as total_transactions and SUM(total_amount) as total_revenue for COMPLETED sales.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Filter: WHERE status = 'COMPLETED'",
      "Group by: GROUP BY store_id",
      "Columns: store_id, COUNT(*) AS total_transactions, SUM(total_amount) AS total_revenue"
    ]
  },
  {
    "id": 12,
    "difficulty": "Medium",
    "tierIndex": 2,
    "ticketId": "INC-202",
    "title": "POS Terminal Server Network Mapping",
    "scenario": "Field engineers troubleshooting network drops need a consolidated list showing each register along with the store name and server IP address it communicates with.",
    "prompt": "Write an INNER JOIN query between Registers and Stores on store_id to display register_id, terminal_number, store_name, and server_ip.",
    "hint": "Join Registers (r) to Stores (s) on r.store_id = s.store_id.",
    "tags": [
      "INNER JOIN",
      "Registers",
      "Stores"
    ],
    "starterCode": "-- Incident INC-202: POS Terminal Server Network Mapping\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT r.register_id, r.terminal_number, s.store_name, s.server_ip FROM Registers r INNER JOIN Stores s ON r.store_id = s.store_id;",
    "isStub": false,
    "simpleGoal": "Combine the Registers and Stores tables to see each register's lane number and its store's name and IP.",
    "simplePrompt": "Join Registers and Stores on store_id. Show register_id, terminal_number, store_name, and server_ip.",
    "simpleSteps": [
      "Tables: Registers (r) INNER JOIN Stores (s) ON r.store_id = s.store_id",
      "Columns to pick: r.register_id, r.terminal_number, s.store_name, s.server_ip"
    ]
  },
  {
    "id": 13,
    "difficulty": "Medium",
    "tierIndex": 3,
    "ticketId": "INC-203",
    "title": "Frequent Error Code Frequency Ranking",
    "scenario": "The software stability team is categorizing bug occurrences across all POS units. They need to know which error codes happen most often.",
    "prompt": "Write a query to select error_code and COUNT(*) AS error_count from ErrorLogs, grouped by error_code, ordered by error_count DESC.",
    "hint": "GROUP BY error_code and add ORDER BY error_count DESC.",
    "tags": [
      "GROUP BY",
      "COUNT",
      "ORDER BY",
      "ErrorLogs"
    ],
    "starterCode": "-- Incident INC-203: Frequent Error Code Frequency Ranking\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT error_code, COUNT(*) AS error_count FROM ErrorLogs GROUP BY error_code ORDER BY error_count DESC;",
    "isStub": false,
    "simpleGoal": "Count how many times each error code happened, ranking the most common problems at the top.",
    "simplePrompt": "From ErrorLogs, group by error_code, show error_code and COUNT(*) as error_count, ordered from highest to lowest count.",
    "simpleSteps": [
      "Target Table: ErrorLogs",
      "Group by: GROUP BY error_code",
      "Sort by: ORDER BY error_count DESC"
    ]
  },
  {
    "id": 14,
    "difficulty": "Medium",
    "tierIndex": 4,
    "ticketId": "INC-204",
    "title": "Total Transactions by Store Name",
    "scenario": "Operations wants to know the transaction count associated with each human-readable store name rather than raw store IDs.",
    "prompt": "Join Transactions and Stores on store_id to display store_name and COUNT(*) AS txn_count, grouped by store_name.",
    "hint": "SELECT s.store_name, COUNT(*) AS txn_count FROM Transactions t INNER JOIN Stores s ON t.store_id = s.store_id GROUP BY s.store_name;",
    "tags": [
      "INNER JOIN",
      "GROUP BY",
      "Transactions",
      "Stores"
    ],
    "starterCode": "-- Incident INC-204: Total Transactions by Store Name\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT s.store_name, COUNT(*) AS txn_count FROM Transactions t INNER JOIN Stores s ON t.store_id = s.store_id GROUP BY s.store_name;",
    "isStub": true,
    "simpleGoal": "Count how many transactions occurred at each store, showing the actual store name.",
    "simplePrompt": "Join Transactions and Stores on store_id. Group by store_name to show store_name and COUNT(*) as txn_count.",
    "simpleSteps": [
      "Tables: Transactions (t) INNER JOIN Stores (s) ON t.store_id = s.store_id",
      "Group by: GROUP BY s.store_name",
      "Columns: s.store_name, COUNT(*) AS txn_count"
    ]
  },
  {
    "id": 15,
    "difficulty": "Medium",
    "tierIndex": 5,
    "ticketId": "INC-205",
    "title": "Active Registers Count per Store",
    "scenario": "Determine how many registers are deployed at each store location.",
    "prompt": "Write a query to display store_id and COUNT(*) AS register_count from Registers grouped by store_id.",
    "hint": "GROUP BY store_id and use COUNT(*).",
    "tags": [
      "GROUP BY",
      "COUNT",
      "Registers"
    ],
    "starterCode": "-- Incident INC-205: Active Registers Count per Store\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, COUNT(*) AS register_count FROM Registers GROUP BY store_id;",
    "isStub": true,
    "simpleGoal": "Count how many cash registers each store has.",
    "simplePrompt": "From Registers, group by store_id and show store_id and COUNT(*) as register_count.",
    "simpleSteps": [
      "Target Table: Registers",
      "Group by: GROUP BY store_id",
      "Columns: store_id, COUNT(*) AS register_count"
    ]
  },
  {
    "id": 16,
    "difficulty": "Medium",
    "tierIndex": 6,
    "ticketId": "INC-206",
    "title": "Payment Method Breakdown for Settled Sales",
    "scenario": "Finance needs a distribution breakdown of payment methods for all completed transactions.",
    "prompt": "Select payment_method, COUNT(*) AS txn_count, SUM(total_amount) AS total_settled from Transactions where status = \"COMPLETED\" group by payment_method.",
    "hint": "Filter WHERE status = 'COMPLETED' and GROUP BY payment_method.",
    "tags": [
      "GROUP BY",
      "SUM",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-206: Payment Method Breakdown for Settled Sales\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT payment_method, COUNT(*) AS txn_count, SUM(total_amount) AS total_settled FROM Transactions WHERE status = 'COMPLETED' GROUP BY payment_method;",
    "isStub": true,
    "simpleGoal": "See total number of sales and total dollar amounts for each payment method (Cash, Credit, etc.) for completed sales.",
    "simplePrompt": "From Transactions where status is 'COMPLETED', group by payment_method. Show payment_method, COUNT(*) as txn_count, and SUM(total_amount) as total_settled.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Filter: WHERE status = 'COMPLETED'",
      "Group by: GROUP BY payment_method",
      "Columns: payment_method, COUNT(*) AS txn_count, SUM(total_amount) AS total_settled"
    ]
  },
  {
    "id": 17,
    "difficulty": "Medium",
    "tierIndex": 7,
    "ticketId": "INC-207",
    "title": "Stores Generating Error Reports",
    "scenario": "Identify the distinct store names that have logged at least one system error.",
    "prompt": "Join Stores and ErrorLogs on store_id to select DISTINCT store_name.",
    "hint": "Use SELECT DISTINCT s.store_name FROM Stores s INNER JOIN ErrorLogs e ON s.store_id = e.store_id;",
    "tags": [
      "INNER JOIN",
      "DISTINCT",
      "Stores",
      "ErrorLogs"
    ],
    "starterCode": "-- Incident INC-207: Stores Generating Error Reports\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT DISTINCT s.store_name FROM Stores s INNER JOIN ErrorLogs e ON s.store_id = e.store_id;",
    "isStub": true,
    "simpleGoal": "Find the names of all stores that had at least one error logged.",
    "simplePrompt": "Join Stores and ErrorLogs on store_id. Show DISTINCT store_name.",
    "simpleSteps": [
      "Tables: Stores (s) INNER JOIN ErrorLogs (e) ON s.store_id = e.store_id",
      "Columns: DISTINCT s.store_name"
    ]
  },
  {
    "id": 18,
    "difficulty": "Medium",
    "tierIndex": 8,
    "ticketId": "INC-208",
    "title": "Fleet Health: Online vs Offline Register Count",
    "scenario": "Executive dashboard metric: calculate the count of registers grouped by their online status (1 vs 0).",
    "prompt": "Select is_online, COUNT(*) AS total_terminals from Registers group by is_online.",
    "hint": "SELECT is_online, COUNT(*) AS total_terminals FROM Registers GROUP BY is_online;",
    "tags": [
      "GROUP BY",
      "Registers"
    ],
    "starterCode": "-- Incident INC-208: Fleet Health: Online vs Offline Register Count\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT is_online, COUNT(*) AS total_terminals FROM Registers GROUP BY is_online;",
    "isStub": true,
    "simpleGoal": "Count how many registers are online (1) vs offline (0).",
    "simplePrompt": "From Registers, group by is_online and show is_online and COUNT(*) as total_terminals.",
    "simpleSteps": [
      "Target Table: Registers",
      "Group by: GROUP BY is_online",
      "Columns: is_online, COUNT(*) AS total_terminals"
    ]
  },
  {
    "id": 19,
    "difficulty": "Medium",
    "tierIndex": 9,
    "ticketId": "INC-209",
    "title": "Transaction Details with Terminal Lane Number",
    "scenario": "Customer support needs transaction receipts correlated with the physical terminal label (e.g. REG-101-01).",
    "prompt": "Join Transactions and Registers on register_id to display transaction_id, terminal_number, total_amount, and status.",
    "hint": "INNER JOIN Registers r ON t.register_id = r.register_id.",
    "tags": [
      "INNER JOIN",
      "Transactions",
      "Registers"
    ],
    "starterCode": "-- Incident INC-209: Transaction Details with Terminal Lane Number\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT t.transaction_id, r.terminal_number, t.total_amount, t.status FROM Transactions t INNER JOIN Registers r ON t.register_id = r.register_id;",
    "isStub": true,
    "simpleGoal": "Show transactions with the physical register lane name (e.g. REG-101-01) where they occurred.",
    "simplePrompt": "Join Transactions and Registers on register_id. Show transaction_id, terminal_number, total_amount, and status.",
    "simpleSteps": [
      "Tables: Transactions (t) INNER JOIN Registers (r) ON t.register_id = r.register_id",
      "Columns: t.transaction_id, r.terminal_number, t.total_amount, t.status"
    ]
  },
  {
    "id": 20,
    "difficulty": "Medium",
    "tierIndex": 10,
    "ticketId": "INC-210",
    "title": "Cashier Average Sale Basket Calculation",
    "scenario": "Calculate the average transaction value handled by each cashier to detect outlier discrepancies.",
    "prompt": "Select cashier_id, COUNT(*) AS txn_count, AVG(total_amount) AS avg_amount from Transactions group by cashier_id.",
    "hint": "Use AVG(total_amount) with GROUP BY cashier_id.",
    "tags": [
      "GROUP BY",
      "AVG",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-210: Cashier Average Sale Basket Calculation\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT cashier_id, COUNT(*) AS txn_count, AVG(total_amount) AS avg_amount FROM Transactions GROUP BY cashier_id;",
    "isStub": true,
    "simpleGoal": "Calculate the average dollar amount spent per cashier.",
    "simplePrompt": "From Transactions, group by cashier_id. Show cashier_id, COUNT(*) as txn_count, and AVG(total_amount) as avg_amount.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Group by: GROUP BY cashier_id",
      "Columns: cashier_id, COUNT(*) AS txn_count, AVG(total_amount) AS avg_amount"
    ]
  },
  {
    "id": 21,
    "difficulty": "Intermediate",
    "tierIndex": 1,
    "ticketId": "INC-301",
    "title": "High Average Value Register Filtering",
    "scenario": "Auditors are checking for potential fraud or high-ticket volume. Find register lanes where the average transaction amount strictly exceeds $100.",
    "prompt": "Write a query to display register_id, COUNT(*) AS txn_count, and AVG(total_amount) AS avg_amount from Transactions, grouped by register_id, having an average amount greater than 100.",
    "hint": "Use the HAVING clause after GROUP BY: HAVING AVG(total_amount) > 100.",
    "tags": [
      "GROUP BY",
      "HAVING",
      "AVG",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-301: High Average Value Register Filtering\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT register_id, COUNT(*) AS txn_count, AVG(total_amount) AS avg_amount FROM Transactions GROUP BY register_id HAVING AVG(total_amount) > 100;",
    "isStub": false,
    "simpleGoal": "Find registers where the average transaction size was higher than $100.",
    "simplePrompt": "Group Transactions by register_id. Show register_id, COUNT(*) as txn_count, and AVG(total_amount) as avg_amount, keeping only registers where the average is over 100.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Group by: GROUP BY register_id",
      "Filter groups: HAVING AVG(total_amount) > 100"
    ]
  },
  {
    "id": 22,
    "difficulty": "Intermediate",
    "tierIndex": 2,
    "ticketId": "INC-302",
    "title": "Registers with Fatal Crash Events (Subquery)",
    "scenario": "A hardware driver glitch causes fatal POS terminal locks. List all register terminals that have recorded at least one FATAL severity error in ErrorLogs.",
    "prompt": "Write a query to select register_id, terminal_number, and store_id from Registers where the register_id exists in a subquery selecting register_id from ErrorLogs with severity = \"FATAL\".",
    "hint": "Use WHERE register_id IN (SELECT register_id FROM ErrorLogs WHERE severity = 'FATAL').",
    "tags": [
      "SUBQUERY",
      "IN",
      "Registers",
      "ErrorLogs"
    ],
    "starterCode": "-- Incident INC-302: Registers with Fatal Crash Events (Subquery)\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT register_id, terminal_number, store_id FROM Registers WHERE register_id IN (SELECT register_id FROM ErrorLogs WHERE severity = 'FATAL');",
    "isStub": false,
    "simpleGoal": "Find registers that had a 'FATAL' error using a subquery.",
    "simplePrompt": "From Registers, show register_id, terminal_number, and store_id where register_id is IN (SELECT register_id FROM ErrorLogs WHERE severity = 'FATAL').",
    "simpleSteps": [
      "Subquery: SELECT register_id FROM ErrorLogs WHERE severity = 'FATAL'",
      "Main query: SELECT register_id, terminal_number, store_id FROM Registers WHERE register_id IN (...)"
    ]
  },
  {
    "id": 23,
    "difficulty": "Intermediate",
    "tierIndex": 3,
    "ticketId": "INC-303",
    "title": "Transaction Basket Size Tiering (CASE WHEN)",
    "scenario": "Marketing and POS Ops need transactions categorized into ticket size tiers: LOW (< $25), MEDIUM ($25 - $100), and HIGH (> $100).",
    "prompt": "Select transaction_id, total_amount, and a computed column amount_tier using a CASE WHEN expression (\"LOW\" when < 25, \"MEDIUM\" when <= 100, else \"HIGH\").",
    "hint": "CASE WHEN total_amount < 25 THEN 'LOW' WHEN total_amount <= 100 THEN 'MEDIUM' ELSE 'HIGH' END AS amount_tier",
    "tags": [
      "CASE WHEN",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-303: Transaction Basket Size Tiering (CASE WHEN)\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT transaction_id, total_amount, CASE WHEN total_amount < 25 THEN 'LOW' WHEN total_amount <= 100 THEN 'MEDIUM' ELSE 'HIGH' END AS amount_tier FROM Transactions;",
    "isStub": false,
    "simpleGoal": "Tag transactions as 'LOW' (< $25), 'MEDIUM' ($25 - $100), or 'HIGH' (> $100).",
    "simplePrompt": "From Transactions, show transaction_id, total_amount, and create an amount_tier column using CASE WHEN.",
    "simpleSteps": [
      "Use CASE WHEN total_amount < 25 THEN 'LOW' WHEN total_amount <= 100 THEN 'MEDIUM' ELSE 'HIGH' END AS amount_tier"
    ]
  },
  {
    "id": 24,
    "difficulty": "Intermediate",
    "tierIndex": 4,
    "ticketId": "INC-304",
    "title": "Busy Store Filter via HAVING",
    "scenario": "Identify heavily loaded store branches that have generated more than 3 transactions in the current test dataset.",
    "prompt": "Select store_id and COUNT(*) AS txn_count from Transactions group by store_id having COUNT(*) > 3.",
    "hint": "Use GROUP BY store_id HAVING COUNT(*) > 3.",
    "tags": [
      "GROUP BY",
      "HAVING",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-304: Busy Store Filter via HAVING\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, COUNT(*) AS txn_count FROM Transactions GROUP BY store_id HAVING COUNT(*) > 3;",
    "isStub": true,
    "simpleGoal": "Find stores that handled more than 3 transactions.",
    "simplePrompt": "From Transactions, group by store_id, show store_id and COUNT(*) as txn_count, having COUNT(*) > 3.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Group by: GROUP BY store_id",
      "Filter groups: HAVING COUNT(*) > 3"
    ]
  },
  {
    "id": 25,
    "difficulty": "Intermediate",
    "tierIndex": 5,
    "ticketId": "INC-305",
    "title": "Transactions from Confirmed Online Stores",
    "scenario": "Validate transactions originating only from stores whose central store server is verified ONLINE.",
    "prompt": "Select transaction_id, store_id, total_amount from Transactions where store_id IN (SELECT store_id FROM Stores WHERE server_status = \"ONLINE\").",
    "hint": "Use an IN subquery targeting Stores with server_status = 'ONLINE'.",
    "tags": [
      "SUBQUERY",
      "IN",
      "Transactions",
      "Stores"
    ],
    "starterCode": "-- Incident INC-305: Transactions from Confirmed Online Stores\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT transaction_id, store_id, total_amount FROM Transactions WHERE store_id IN (SELECT store_id FROM Stores WHERE server_status = 'ONLINE');",
    "isStub": true,
    "simpleGoal": "Find all transactions that came from stores whose server is currently ONLINE.",
    "simplePrompt": "From Transactions, show transaction_id, store_id, and total_amount for stores where server_status is ONLINE.",
    "simpleSteps": [
      "Subquery: SELECT store_id FROM Stores WHERE server_status = 'ONLINE'",
      "Main query: SELECT transaction_id, store_id, total_amount FROM Transactions WHERE store_id IN (...)"
    ]
  },
  {
    "id": 26,
    "difficulty": "Intermediate",
    "tierIndex": 6,
    "ticketId": "INC-306",
    "title": "Store Settlement Matrix by Status",
    "scenario": "Break down each store's transaction count by their status (e.g. COMPLETED, FAILED, PENDING_SYNC).",
    "prompt": "Select store_id, status, COUNT(*) AS txn_count from Transactions group by store_id, status order by store_id ASC.",
    "hint": "GROUP BY store_id, status ORDER BY store_id ASC.",
    "tags": [
      "GROUP BY",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-306: Store Settlement Matrix by Status\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, status, COUNT(*) AS txn_count FROM Transactions GROUP BY store_id, status ORDER BY store_id ASC;",
    "isStub": true,
    "simpleGoal": "Show how many transactions happened for each status (COMPLETED, FAILED, etc.) across each store.",
    "simplePrompt": "From Transactions, group by store_id and status. Show store_id, status, and COUNT(*) as txn_count, ordered by store_id.",
    "simpleSteps": [
      "Target Table: Transactions",
      "Group by: GROUP BY store_id, status",
      "Order by: ORDER BY store_id ASC"
    ]
  },
  {
    "id": 27,
    "difficulty": "Intermediate",
    "tierIndex": 7,
    "ticketId": "INC-307",
    "title": "Fault-Free Register Fleet Detection",
    "scenario": "Support wants to identify healthy registers that have NEVER produced any error logs in the database.",
    "prompt": "Select register_id, terminal_number from Registers where register_id NOT IN (SELECT register_id FROM ErrorLogs WHERE register_id IS NOT NULL).",
    "hint": "Use NOT IN (SELECT register_id FROM ErrorLogs WHERE register_id IS NOT NULL).",
    "tags": [
      "SUBQUERY",
      "NOT IN",
      "Registers",
      "ErrorLogs"
    ],
    "starterCode": "-- Incident INC-307: Fault-Free Register Fleet Detection\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT register_id, terminal_number FROM Registers WHERE register_id NOT IN (SELECT register_id FROM ErrorLogs WHERE register_id IS NOT NULL);",
    "isStub": true,
    "simpleGoal": "Find healthy registers that have NEVER had an error logged.",
    "simplePrompt": "From Registers, show register_id and terminal_number for registers that do NOT appear in the ErrorLogs table.",
    "simpleSteps": [
      "Subquery: SELECT register_id FROM ErrorLogs WHERE register_id IS NOT NULL",
      "Condition: WHERE register_id NOT IN (...)"
    ]
  },
  {
    "id": 28,
    "difficulty": "Intermediate",
    "tierIndex": 8,
    "ticketId": "INC-308",
    "title": "Register Operational Health Tagging",
    "scenario": "Tag each register as \"HEALTHY_ONLINE\" if is_online = 1, otherwise \"DISCONNECTED\" using CASE WHEN.",
    "prompt": "Select register_id, terminal_number, CASE WHEN is_online = 1 THEN \"HEALTHY_ONLINE\" ELSE \"DISCONNECTED\" END AS health_status from Registers.",
    "hint": "Use CASE WHEN is_online = 1 THEN 'HEALTHY_ONLINE' ELSE 'DISCONNECTED' END AS health_status.",
    "tags": [
      "CASE WHEN",
      "Registers"
    ],
    "starterCode": "-- Incident INC-308: Register Operational Health Tagging\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT register_id, terminal_number, CASE WHEN is_online = 1 THEN 'HEALTHY_ONLINE' ELSE 'DISCONNECTED' END AS health_status FROM Registers;",
    "isStub": true,
    "simpleGoal": "Add a health label: 'HEALTHY_ONLINE' if is_online is 1, otherwise 'DISCONNECTED'.",
    "simplePrompt": "From Registers, show register_id, terminal_number, and a CASE WHEN column called health_status.",
    "simpleSteps": [
      "Use CASE WHEN is_online = 1 THEN 'HEALTHY_ONLINE' ELSE 'DISCONNECTED' END AS health_status"
    ]
  },
  {
    "id": 29,
    "difficulty": "Intermediate",
    "tierIndex": 9,
    "ticketId": "INC-309",
    "title": "Stores with Critical Error Incidents",
    "scenario": "List all store details where at least one CRITICAL error has been logged.",
    "prompt": "Select store_id, store_name, city from Stores where store_id IN (SELECT store_id FROM ErrorLogs WHERE severity = \"CRITICAL\").",
    "hint": "WHERE store_id IN (SELECT store_id FROM ErrorLogs WHERE severity = 'CRITICAL')",
    "tags": [
      "SUBQUERY",
      "IN",
      "Stores",
      "ErrorLogs"
    ],
    "starterCode": "-- Incident INC-309: Stores with Critical Error Incidents\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, store_name, city FROM Stores WHERE store_id IN (SELECT store_id FROM ErrorLogs WHERE severity = 'CRITICAL');",
    "isStub": true,
    "simpleGoal": "Find all stores that had at least one 'CRITICAL' error logged.",
    "simplePrompt": "From Stores, show store_id, store_name, and city for stores that appear in ErrorLogs with severity 'CRITICAL'.",
    "simpleSteps": [
      "Subquery: SELECT store_id FROM ErrorLogs WHERE severity = 'CRITICAL'",
      "Condition: WHERE store_id IN (...)"
    ]
  },
  {
    "id": 30,
    "difficulty": "Intermediate",
    "tierIndex": 10,
    "ticketId": "INC-310",
    "title": "Cashiers with Multiple Failed Tenders",
    "scenario": "Locate cashier accounts that have experienced at least one failed transaction to check if POS training is required.",
    "prompt": "Select cashier_id, COUNT(*) AS failed_count from Transactions where status = \"FAILED\" group by cashier_id having COUNT(*) >= 1.",
    "hint": "Filter WHERE status = 'FAILED' then GROUP BY cashier_id HAVING COUNT(*) >= 1.",
    "tags": [
      "GROUP BY",
      "HAVING",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-310: Cashiers with Multiple Failed Tenders\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT cashier_id, COUNT(*) AS failed_count FROM Transactions WHERE status = 'FAILED' GROUP BY cashier_id HAVING COUNT(*) >= 1;",
    "isStub": true,
    "simpleGoal": "Find cashiers who had at least 1 failed sale to see who might need help.",
    "simplePrompt": "From Transactions where status is 'FAILED', group by cashier_id. Show cashier_id and COUNT(*) as failed_count having COUNT(*) >= 1.",
    "simpleSteps": [
      "Filter: WHERE status = 'FAILED'",
      "Group by: GROUP BY cashier_id",
      "Filter groups: HAVING COUNT(*) >= 1"
    ]
  },
  {
    "id": 31,
    "difficulty": "Advanced",
    "tierIndex": 1,
    "ticketId": "INC-401",
    "title": "Register-Level LAN Failure Detection",
    "scenario": "A common retail network failure mode is when the store controller server is healthy and ONLINE, but individual terminal lanes have lost LAN connectivity. Identify these isolated terminal outages.",
    "prompt": "Write a query joining Stores and Registers on store_id to select s.store_id, s.store_name, r.register_id, and r.terminal_number where s.server_status = \"ONLINE\" and r.is_online = 0.",
    "hint": "Perform an INNER JOIN between Stores (s) and Registers (r) on s.store_id = r.store_id, filtering with WHERE s.server_status = 'ONLINE' AND r.is_online = 0.",
    "tags": [
      "INNER JOIN",
      "Multi-condition",
      "Stores",
      "Registers"
    ],
    "starterCode": "-- Incident INC-401: Register-Level LAN Failure Detection\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT s.store_id, s.store_name, r.register_id, r.terminal_number FROM Stores s INNER JOIN Registers r ON s.store_id = r.store_id WHERE s.server_status = 'ONLINE' AND r.is_online = 0;",
    "isStub": false,
    "simpleGoal": "Find stores where the store server is ONLINE, but an individual register lane is OFFLINE.",
    "simplePrompt": "Join Stores and Registers on store_id. Show s.store_id, s.store_name, r.register_id, and r.terminal_number where server is ONLINE but register is_online is 0.",
    "simpleSteps": [
      "Tables: Stores (s) INNER JOIN Registers (r) ON s.store_id = r.store_id",
      "Condition: WHERE s.server_status = 'ONLINE' AND r.is_online = 0"
    ]
  },
  {
    "id": 32,
    "difficulty": "Advanced",
    "tierIndex": 2,
    "ticketId": "INC-402",
    "title": "Registers Failing More Than Succeeding",
    "scenario": "Terminal hardware or payment reader firmware corruption can cause extreme transaction failure rates. Identify registers where the count of FAILED transactions strictly exceeds the count of COMPLETED transactions.",
    "prompt": "Write a query grouping Transactions by register_id that computes failed_count (using SUM CASE WHEN status = \"FAILED\") and completed_count (SUM CASE WHEN status = \"COMPLETED\"), and use HAVING to filter registers where failed_count > completed_count.",
    "hint": "Use SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS failed_count and test in the HAVING clause.",
    "tags": [
      "GROUP BY",
      "HAVING",
      "Conditional SUM",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-402: Registers Failing More Than Succeeding\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT register_id, SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS failed_count, SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_count FROM Transactions GROUP BY register_id HAVING SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) > SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END);",
    "isStub": false,
    "simpleGoal": "Find broken registers that had MORE failed transactions than completed ones.",
    "simplePrompt": "Group Transactions by register_id. Calculate failed_count and completed_count, and use HAVING to show registers where failed_count is greater than completed_count.",
    "simpleSteps": [
      "Use SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS failed_count",
      "Use SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_count",
      "Condition: HAVING SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) > SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END)"
    ]
  },
  {
    "id": 33,
    "difficulty": "Advanced",
    "tierIndex": 3,
    "ticketId": "INC-403",
    "title": "Sync Timeouts Correlated with Pending Sales",
    "scenario": "During upstream cloud gateway timeouts, transactions become stuck in PENDING_SYNC while error logs record ERR_SYNC_TIMEOUT. Find the distinct stores that have both symptoms.",
    "prompt": "Write a query to select DISTINCT t.store_id, s.store_name by joining Transactions (t), Stores (s), and ErrorLogs (e) where t.status = \"PENDING_SYNC\" and e.error_code = \"ERR_SYNC_TIMEOUT\".",
    "hint": "Join Transactions t with Stores s on t.store_id = s.store_id and with ErrorLogs e on t.store_id = e.store_id.",
    "tags": [
      "MULTI-JOIN",
      "DISTINCT",
      "Transactions",
      "Stores",
      "ErrorLogs"
    ],
    "starterCode": "-- Incident INC-403: Sync Timeouts Correlated with Pending Sales\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT DISTINCT t.store_id, s.store_name FROM Transactions t INNER JOIN Stores s ON t.store_id = s.store_id INNER JOIN ErrorLogs e ON t.store_id = e.store_id WHERE t.status = 'PENDING_SYNC' AND e.error_code = 'ERR_SYNC_TIMEOUT';",
    "isStub": false,
    "simpleGoal": "Find stores that have stuck pending transactions AND logged an 'ERR_SYNC_TIMEOUT' error.",
    "simplePrompt": "Join Transactions, Stores, and ErrorLogs on store_id. Show DISTINCT t.store_id and s.store_name where status is 'PENDING_SYNC' and error_code is 'ERR_SYNC_TIMEOUT'.",
    "simpleSteps": [
      "Join Transactions (t), Stores (s), and ErrorLogs (e) on store_id",
      "Condition: WHERE t.status = 'PENDING_SYNC' AND e.error_code = 'ERR_SYNC_TIMEOUT'",
      "Columns: DISTINCT t.store_id, s.store_name"
    ]
  },
  {
    "id": 34,
    "difficulty": "Advanced",
    "tierIndex": 4,
    "ticketId": "INC-404",
    "title": "Store Outage Impact Assessment",
    "scenario": "When a store server goes completely OFFLINE, all registers at that store cannot communicate with central inventory. List all offline stores along with the total count of registers affected.",
    "prompt": "Join Stores and Registers on store_id for stores where server_status = \"OFFLINE\" to display s.store_id, s.store_name, and COUNT(r.register_id) AS impacted_registers, grouped by s.store_id, s.store_name.",
    "hint": "SELECT s.store_id, s.store_name, COUNT(r.register_id) AS impacted_registers FROM Stores s INNER JOIN Registers r ON s.store_id = r.store_id WHERE s.server_status = 'OFFLINE' GROUP BY s.store_id, s.store_name;",
    "tags": [
      "INNER JOIN",
      "GROUP BY",
      "COUNT",
      "Stores",
      "Registers"
    ],
    "starterCode": "-- Incident INC-404: Store Outage Impact Assessment\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT s.store_id, s.store_name, COUNT(r.register_id) AS impacted_registers FROM Stores s INNER JOIN Registers r ON s.store_id = r.store_id WHERE s.server_status = 'OFFLINE' GROUP BY s.store_id, s.store_name;",
    "isStub": true,
    "simpleGoal": "Count how many registers are affected at stores that are completely OFFLINE.",
    "simplePrompt": "Join Stores and Registers on store_id for stores where server_status is 'OFFLINE'. Group by store_id and store_name, showing COUNT(r.register_id) as impacted_registers.",
    "simpleSteps": [
      "Tables: Stores (s) INNER JOIN Registers (r) ON s.store_id = r.store_id",
      "Filter: WHERE s.server_status = 'OFFLINE'",
      "Group by: GROUP BY s.store_id, s.store_name",
      "Column: COUNT(r.register_id) AS impacted_registers"
    ]
  },
  {
    "id": 35,
    "difficulty": "Advanced",
    "tierIndex": 5,
    "ticketId": "INC-405",
    "title": "Above-Average Transaction Amount Anomaly Detector",
    "scenario": "Flag all individual transactions where the total amount exceeds the global average transaction amount across the entire retail network.",
    "prompt": "Select transaction_id, store_id, total_amount from Transactions where total_amount > (SELECT AVG(total_amount) FROM Transactions).",
    "hint": "Use a scalar subquery: WHERE total_amount > (SELECT AVG(total_amount) FROM Transactions).",
    "tags": [
      "SCALAR SUBQUERY",
      "AVG",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-405: Above-Average Transaction Amount Anomaly Detector\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT transaction_id, store_id, total_amount FROM Transactions WHERE total_amount > (SELECT AVG(total_amount) FROM Transactions);",
    "isStub": true,
    "simpleGoal": "Find individual orders that were larger than the average transaction amount of the whole company.",
    "simplePrompt": "From Transactions, show transaction_id, store_id, and total_amount where total_amount is greater than (SELECT AVG(total_amount) FROM Transactions).",
    "simpleSteps": [
      "Subquery: (SELECT AVG(total_amount) FROM Transactions)",
      "Condition: WHERE total_amount > (SELECT AVG(total_amount) FROM Transactions)"
    ]
  },
  {
    "id": 36,
    "difficulty": "Advanced",
    "tierIndex": 6,
    "ticketId": "INC-406",
    "title": "Offline Register with Pending Unsynced Sales",
    "scenario": "Critical POS data risk: find transactions that are PENDING_SYNC originating from registers that are currently marked is_online = 0.",
    "prompt": "Join Transactions and Registers on register_id to select t.transaction_id, t.register_id, r.terminal_number, t.total_amount where t.status = \"PENDING_SYNC\" and r.is_online = 0.",
    "hint": "INNER JOIN Registers r ON t.register_id = r.register_id WHERE t.status = 'PENDING_SYNC' AND r.is_online = 0;",
    "tags": [
      "INNER JOIN",
      "Transactions",
      "Registers"
    ],
    "starterCode": "-- Incident INC-406: Offline Register with Pending Unsynced Sales\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT t.transaction_id, t.register_id, r.terminal_number, t.total_amount FROM Transactions t INNER JOIN Registers r ON t.register_id = r.register_id WHERE t.status = 'PENDING_SYNC' AND r.is_online = 0;",
    "isStub": true,
    "simpleGoal": "Find orders stuck in PENDING_SYNC on registers that are currently disconnected (is_online = 0).",
    "simplePrompt": "Join Transactions and Registers on register_id. Show t.transaction_id, t.register_id, r.terminal_number, and t.total_amount where status is 'PENDING_SYNC' and register is offline.",
    "simpleSteps": [
      "Tables: Transactions (t) INNER JOIN Registers (r) ON t.register_id = r.register_id",
      "Condition: WHERE t.status = 'PENDING_SYNC' AND r.is_online = 0"
    ]
  },
  {
    "id": 37,
    "difficulty": "Advanced",
    "tierIndex": 7,
    "ticketId": "INC-407",
    "title": "Error Log Correlation with Register Models",
    "scenario": "Engineering needs to know which hardware terminal models suffer the highest frequency of errors.",
    "prompt": "Join Registers and ErrorLogs on register_id to display r.model, COUNT(*) AS total_errors grouped by r.model order by total_errors DESC.",
    "hint": "GROUP BY r.model ORDER BY total_errors DESC.",
    "tags": [
      "INNER JOIN",
      "GROUP BY",
      "Registers",
      "ErrorLogs"
    ],
    "starterCode": "-- Incident INC-407: Error Log Correlation with Register Models\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT r.model, COUNT(*) AS total_errors FROM Registers r INNER JOIN ErrorLogs e ON r.register_id = e.register_id GROUP BY r.model ORDER BY total_errors DESC;",
    "isStub": true,
    "simpleGoal": "Rank register hardware models by which ones experience the highest total number of errors.",
    "simplePrompt": "Join Registers and ErrorLogs on register_id. Group by r.model, show r.model and COUNT(*) as total_errors, ordered from most errors to least.",
    "simpleSteps": [
      "Tables: Registers (r) INNER JOIN ErrorLogs (e) ON r.register_id = e.register_id",
      "Group by: GROUP BY r.model",
      "Sort: ORDER BY total_errors DESC"
    ]
  },
  {
    "id": 38,
    "difficulty": "Advanced",
    "tierIndex": 8,
    "ticketId": "INC-408",
    "title": "Stores with Repeated Payment Gateway Failures",
    "scenario": "Identify stores that experienced ERR_PAYMENT_GATEWAY_TIMEOUT errors and calculate how many times it occurred.",
    "prompt": "Select store_id, COUNT(*) AS timeout_count from ErrorLogs where error_code = \"ERR_PAYMENT_GATEWAY_TIMEOUT\" group by store_id having COUNT(*) > 1.",
    "hint": "WHERE error_code = 'ERR_PAYMENT_GATEWAY_TIMEOUT' GROUP BY store_id HAVING COUNT(*) > 1;",
    "tags": [
      "GROUP BY",
      "HAVING",
      "ErrorLogs"
    ],
    "starterCode": "-- Incident INC-408: Stores with Repeated Payment Gateway Failures\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, COUNT(*) AS timeout_count FROM ErrorLogs WHERE error_code = 'ERR_PAYMENT_GATEWAY_TIMEOUT' GROUP BY store_id HAVING COUNT(*) > 1;",
    "isStub": true,
    "simpleGoal": "Find stores that experienced payment gateway timeouts more than once.",
    "simplePrompt": "From ErrorLogs where error_code is 'ERR_PAYMENT_GATEWAY_TIMEOUT', group by store_id. Show store_id and COUNT(*) as timeout_count having COUNT(*) > 1.",
    "simpleSteps": [
      "Filter: WHERE error_code = 'ERR_PAYMENT_GATEWAY_TIMEOUT'",
      "Group by: GROUP BY store_id",
      "Filter groups: HAVING COUNT(*) > 1"
    ]
  },
  {
    "id": 39,
    "difficulty": "Advanced",
    "tierIndex": 9,
    "ticketId": "INC-409",
    "title": "Total Revenue Loss from Failed Transactions",
    "scenario": "Calculate the cumulative monetary value of all transactions that ended in FAILED status, grouped by store_id.",
    "prompt": "Select store_id, COUNT(*) AS failed_txns, SUM(total_amount) AS lost_revenue from Transactions where status = \"FAILED\" group by store_id;",
    "hint": "WHERE status = 'FAILED' GROUP BY store_id;",
    "tags": [
      "GROUP BY",
      "SUM",
      "Transactions"
    ],
    "starterCode": "-- Incident INC-409: Total Revenue Loss from Failed Transactions\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, COUNT(*) AS failed_txns, SUM(total_amount) AS lost_revenue FROM Transactions WHERE status = 'FAILED' GROUP BY store_id;",
    "isStub": true,
    "simpleGoal": "Calculate how much money was lost due to failed transactions at each store.",
    "simplePrompt": "From Transactions where status is 'FAILED', group by store_id. Show store_id, COUNT(*) as failed_txns, and SUM(total_amount) as lost_revenue.",
    "simpleSteps": [
      "Filter: WHERE status = 'FAILED'",
      "Group by: GROUP BY store_id",
      "Columns: store_id, COUNT(*) AS failed_txns, SUM(total_amount) AS lost_revenue"
    ]
  },
  {
    "id": 40,
    "difficulty": "Advanced",
    "tierIndex": 10,
    "ticketId": "INC-410",
    "title": "Enterprise Incident Summary Audit",
    "scenario": "Produce an executive incident dashboard list showing all store branches that currently have server_status NOT EQUAL to \"ONLINE\" along with their server IP and status.",
    "prompt": "Select store_id, store_name, city, server_ip, server_status from Stores where server_status != \"ONLINE\" order by server_status ASC, store_id ASC;",
    "hint": "Use WHERE server_status != 'ONLINE' ORDER BY server_status ASC, store_id ASC;",
    "tags": [
      "SELECT",
      "WHERE",
      "ORDER BY",
      "Stores"
    ],
    "starterCode": "-- Incident INC-410: Enterprise Incident Summary Audit\n-- Write your SQL query below:\n",
    "expectedQuery": "SELECT store_id, store_name, city, server_ip, server_status FROM Stores WHERE server_status != 'ONLINE' ORDER BY server_status ASC, store_id ASC;",
    "isStub": true,
    "simpleGoal": "List all store servers that are NOT running normally (anything other than 'ONLINE').",
    "simplePrompt": "From Stores, show store_id, store_name, city, server_ip, and server_status where server_status != 'ONLINE', ordered by server_status and store_id.",
    "simpleSteps": [
      "Target Table: Stores",
      "Condition: WHERE server_status != 'ONLINE'",
      "Sort: ORDER BY server_status ASC, store_id ASC"
    ]
  }
];

export const difficultyColors = {
  Basic: {
    badge: 'bg-blue-950/70 text-sky-300 border-blue-500/30 shadow-sm shadow-blue-950/40',
    dot: 'bg-sky-400',
    border: 'border-blue-500/40',
    glow: 'shadow-blue-500/20'
  },
  Medium: {
    badge: 'bg-blue-900/40 text-blue-300 border-blue-400/40 shadow-sm shadow-blue-950/40',
    dot: 'bg-blue-400',
    border: 'border-blue-400/40',
    glow: 'shadow-blue-500/20'
  },
  Intermediate: {
    badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-950/40',
    dot: 'bg-indigo-400',
    border: 'border-indigo-500/40',
    glow: 'shadow-indigo-500/20'
  },
  Advanced: {
    badge: 'bg-slate-900/80 text-blue-200 border-blue-600/40 shadow-sm shadow-blue-900/30',
    dot: 'bg-blue-300',
    border: 'border-blue-600/40',
    glow: 'shadow-blue-600/20'
  }
};
