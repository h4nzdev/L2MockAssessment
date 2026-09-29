import alasql from 'alasql';

export const mockStores = [
  { store_id: 101, store_name: 'Metro Flagship Downtown', city: 'Seattle', state: 'WA', server_ip: '10.101.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:58:10' },
  { store_id: 102, store_name: 'Northgate Mall Outlet', city: 'Seattle', state: 'WA', server_ip: '10.102.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:59:01' },
  { store_id: 103, store_name: 'Bellevue Square Center', city: 'Bellevue', state: 'WA', server_ip: '10.103.0.5', server_status: 'OFFLINE', last_heartbeat: '2026-09-29 18:14:22' },
  { store_id: 104, store_name: 'Portland Riverfront', city: 'Portland', state: 'OR', server_ip: '10.104.0.5', server_status: 'DEGRADED', last_heartbeat: '2026-09-29 22:45:00' },
  { store_id: 105, store_name: 'San Francisco Market St', city: 'San Francisco', state: 'CA', server_ip: '10.105.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:59:45' },
  { store_id: 106, store_name: 'San Jose Silicon Valley', city: 'San Jose', state: 'CA', server_ip: '10.106.0.5', server_status: 'OFFLINE', last_heartbeat: '2026-09-29 14:30:00' },
  { store_id: 107, store_name: 'Denver Highlands', city: 'Denver', state: 'CO', server_ip: '10.107.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:58:30' },
  { store_id: 108, store_name: 'Austin Domain Plaza', city: 'Austin', state: 'TX', server_ip: '10.108.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:59:15' },
  { store_id: 109, store_name: 'Chicago Loop Express', city: 'Chicago', state: 'IL', server_ip: '10.109.0.5', server_status: 'DEGRADED', last_heartbeat: '2026-09-29 22:30:10' },
  { store_id: 110, store_name: 'Boston Back Bay', city: 'Boston', state: 'MA', server_ip: '110.110.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:57:40' },
  { store_id: 111, store_name: 'Manhattan Midtown Flagship', city: 'New York', state: 'NY', server_ip: '10.111.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:59:50' },
  { store_id: 112, store_name: 'Brooklyn Williamsburg Hub', city: 'Brooklyn', state: 'NY', server_ip: '10.112.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:58:20' },
  { store_id: 113, store_name: 'Miami South Beach Plaza', city: 'Miami', state: 'FL', server_ip: '10.113.0.5', server_status: 'OFFLINE', last_heartbeat: '2026-09-29 16:45:00' },
  { store_id: 114, store_name: 'Orlando Theme Park Walk', city: 'Orlando', state: 'FL', server_ip: '10.114.0.5', server_status: 'DEGRADED', last_heartbeat: '2026-09-29 22:35:10' },
  { store_id: 115, store_name: 'Atlanta Buckhead Center', city: 'Atlanta', state: 'GA', server_ip: '10.115.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:59:10' },
  { store_id: 116, store_name: 'Dallas Galleria Lane', city: 'Dallas', state: 'TX', server_ip: '10.116.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:58:45' },
  { store_id: 117, store_name: 'Houston Galleria Promenade', city: 'Houston', state: 'TX', server_ip: '10.117.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:59:30' },
  { store_id: 118, store_name: 'Phoenix Biltmore Fashion', city: 'Phoenix', state: 'AZ', server_ip: '10.118.0.5', server_status: 'OFFLINE', last_heartbeat: '2026-09-29 11:15:00' },
  { store_id: 119, store_name: 'Las Vegas Strip Grand', city: 'Las Vegas', state: 'NV', server_ip: '10.119.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:59:55' },
  { store_id: 120, store_name: 'Spokane Valley Mall', city: 'Spokane', state: 'WA', server_ip: '10.120.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:58:05' },
  { store_id: 121, store_name: 'Minneapolis Skyway Center', city: 'Minneapolis', state: 'MN', server_ip: '10.121.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:58:50' },
  { store_id: 122, store_name: 'Detroit Renaissance Plaza', city: 'Detroit', state: 'MI', server_ip: '10.122.0.5', server_status: 'DEGRADED', last_heartbeat: '2026-09-29 22:40:15' },
  { store_id: 123, store_name: 'Charlotte South End Walk', city: 'Charlotte', state: 'NC', server_ip: '10.123.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:59:10' },
  { store_id: 124, store_name: 'Nashville Broadway Station', city: 'Nashville', state: 'TN', server_ip: '10.124.0.5', server_status: 'ONLINE', last_heartbeat: '2026-09-29 22:57:25' },
  { store_id: 125, store_name: 'Salt Lake City Creek Center', city: 'Salt Lake City', state: 'UT', server_ip: '10.125.0.5', server_status: 'OFFLINE', last_heartbeat: '2026-09-29 17:20:00' }
];

export const mockRegisters = [
  { register_id: 201, store_id: 101, terminal_number: 'REG-101-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:55:00' },
  { register_id: 202, store_id: 101, terminal_number: 'REG-101-02', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:54:12' },
  { register_id: 203, store_id: 101, terminal_number: 'REG-101-03', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 19:20:00' },
  { register_id: 204, store_id: 102, terminal_number: 'REG-102-01', model: 'Ingenico Lane 5000', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:57:10' },
  { register_id: 205, store_id: 102, terminal_number: 'REG-102-02', model: 'Ingenico Lane 5000', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:56:45' },
  { register_id: 206, store_id: 103, terminal_number: 'REG-103-01', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 18:10:00' },
  { register_id: 207, store_id: 103, terminal_number: 'REG-103-02', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 18:12:00' },
  { register_id: 208, store_id: 104, terminal_number: 'REG-104-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:40:00' },
  { register_id: 209, store_id: 104, terminal_number: 'REG-104-02', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 0, last_sync: '2026-09-29 20:15:30' },
  { register_id: 210, store_id: 105, terminal_number: 'REG-105-01', model: 'Ingenico Lane 5000', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:58:00' },
  { register_id: 211, store_id: 105, terminal_number: 'REG-105-02', model: 'Ingenico Lane 5000', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:58:30' },
  { register_id: 212, store_id: 106, terminal_number: 'REG-106-01', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 14:20:00' },
  { register_id: 213, store_id: 107, terminal_number: 'REG-107-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:50:00' },
  { register_id: 214, store_id: 108, terminal_number: 'REG-108-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:52:10' },
  { register_id: 215, store_id: 108, terminal_number: 'REG-108-02', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 21:05:00' },
  { register_id: 216, store_id: 109, terminal_number: 'REG-109-01', model: 'Ingenico Lane 5000', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:25:00' },
  { register_id: 217, store_id: 110, terminal_number: 'REG-110-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:55:10' },
  { register_id: 218, store_id: 111, terminal_number: 'REG-111-01', model: 'Toshiba TCxWave', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:59:12' },
  { register_id: 219, store_id: 111, terminal_number: 'REG-111-02', model: 'Toshiba TCxWave', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:58:40' },
  { register_id: 220, store_id: 111, terminal_number: 'REG-111-03', model: 'Ingenico Lane 5000', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:59:00' },
  { register_id: 221, store_id: 112, terminal_number: 'REG-112-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:56:30' },
  { register_id: 222, store_id: 113, terminal_number: 'REG-113-01', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 16:40:00' },
  { register_id: 223, store_id: 113, terminal_number: 'REG-113-02', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 16:42:00' },
  { register_id: 224, store_id: 114, terminal_number: 'REG-114-01', model: 'Ingenico Lane 5000', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:30:00' },
  { register_id: 225, store_id: 115, terminal_number: 'REG-115-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:57:00' },
  { register_id: 226, store_id: 116, terminal_number: 'REG-116-01', model: 'Toshiba TCxWave', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:58:15' },
  { register_id: 227, store_id: 117, terminal_number: 'REG-117-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:59:00' },
  { register_id: 228, store_id: 118, terminal_number: 'REG-118-01', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 11:10:00' },
  { register_id: 229, store_id: 119, terminal_number: 'REG-119-01', model: 'Ingenico Lane 5000', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:58:30' },
  { register_id: 230, store_id: 120, terminal_number: 'REG-120-01', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 1, last_sync: '2026-09-29 22:57:15' },
  { register_id: 231, store_id: 121, terminal_number: 'REG-121-01', model: 'Toshiba TCxWave', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:58:10' },
  { register_id: 232, store_id: 121, terminal_number: 'REG-121-02', model: 'Toshiba TCxWave', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:56:00' },
  { register_id: 233, store_id: 122, terminal_number: 'REG-122-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:38:20' },
  { register_id: 234, store_id: 122, terminal_number: 'REG-122-02', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 19:45:00' },
  { register_id: 235, store_id: 123, terminal_number: 'REG-123-01', model: 'Ingenico Lane 5000', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:58:00' },
  { register_id: 236, store_id: 124, terminal_number: 'REG-124-01', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:56:40' },
  { register_id: 237, store_id: 124, terminal_number: 'REG-124-02', model: 'Verifone M400', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:57:10' },
  { register_id: 238, store_id: 125, terminal_number: 'REG-125-01', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 17:15:00' },
  { register_id: 239, store_id: 125, terminal_number: 'REG-125-02', model: 'NCR RealPOS 70', os_version: 'Ubuntu POS 22.04', is_online: 0, last_sync: '2026-09-29 17:18:00' },
  { register_id: 240, store_id: 101, terminal_number: 'REG-101-04', model: 'Toshiba TCxWave', os_version: 'Windows 10 IoT', is_online: 1, last_sync: '2026-09-29 22:59:05' }
];

export const mockTransactions = [
  { transaction_id: 1001, register_id: 201, store_id: 101, cashier_id: 'CSH-401', total_amount: 142.50, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 20:10:15' },
  { transaction_id: 1002, register_id: 201, store_id: 101, cashier_id: 'CSH-401', total_amount: 19.99, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 20:15:30' },
  { transaction_id: 1003, register_id: 201, store_id: 101, cashier_id: 'CSH-401', total_amount: 88.00, payment_method: 'DEBIT', status: 'FAILED', created_at: '2026-09-29 20:20:45' },
  { transaction_id: 1004, register_id: 202, store_id: 101, cashier_id: 'CSH-402', total_amount: 320.75, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 20:22:10' },
  { transaction_id: 1005, register_id: 202, store_id: 101, cashier_id: 'CSH-402', total_amount: 45.00, payment_method: 'GIFT_CARD', status: 'COMPLETED', created_at: '2026-09-29 20:25:00' },
  { transaction_id: 1006, register_id: 203, store_id: 101, cashier_id: 'CSH-403', total_amount: 215.10, payment_method: 'CREDIT', status: 'PENDING_SYNC', created_at: '2026-09-29 19:15:00' },
  { transaction_id: 1007, register_id: 203, store_id: 101, cashier_id: 'CSH-403', total_amount: 55.40, payment_method: 'DEBIT', status: 'PENDING_SYNC', created_at: '2026-09-29 19:18:22' },
  { transaction_id: 1008, register_id: 204, store_id: 102, cashier_id: 'CSH-501', total_amount: 12.50, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 21:00:10' },
  { transaction_id: 1009, register_id: 204, store_id: 102, cashier_id: 'CSH-501', total_amount: 450.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 21:05:40' },
  { transaction_id: 1010, register_id: 205, store_id: 102, cashier_id: 'CSH-502', total_amount: 78.20, payment_method: 'MOBILE_PAY', status: 'COMPLETED', created_at: '2026-09-29 21:10:00' },
  { transaction_id: 1011, register_id: 205, store_id: 102, cashier_id: 'CSH-502', total_amount: 110.00, payment_method: 'CREDIT', status: 'VOIDED', created_at: '2026-09-29 21:15:15' },
  { transaction_id: 1012, register_id: 208, store_id: 104, cashier_id: 'CSH-601', total_amount: 64.30, payment_method: 'CREDIT', status: 'FAILED', created_at: '2026-09-29 21:30:20' },
  { transaction_id: 1013, register_id: 208, store_id: 104, cashier_id: 'CSH-601', total_amount: 250.00, payment_method: 'CREDIT', status: 'FAILED', created_at: '2026-09-29 21:32:00' },
  { transaction_id: 1014, register_id: 208, store_id: 104, cashier_id: 'CSH-601', total_amount: 35.00, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 21:40:12' },
  { transaction_id: 1015, register_id: 209, store_id: 104, cashier_id: 'CSH-602', total_amount: 180.00, payment_method: 'DEBIT', status: 'PENDING_SYNC', created_at: '2026-09-29 20:10:00' },
  { transaction_id: 1016, register_id: 210, store_id: 105, cashier_id: 'CSH-701', total_amount: 520.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:01:00' },
  { transaction_id: 1017, register_id: 210, store_id: 105, cashier_id: 'CSH-701', total_amount: 15.00, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 22:05:30' },
  { transaction_id: 1018, register_id: 211, store_id: 105, cashier_id: 'CSH-702', total_amount: 89.90, payment_method: 'MOBILE_PAY', status: 'COMPLETED', created_at: '2026-09-29 22:15:00' },
  { transaction_id: 1019, register_id: 213, store_id: 107, cashier_id: 'CSH-801', total_amount: 340.50, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 21:50:20' },
  { transaction_id: 1020, register_id: 214, store_id: 108, cashier_id: 'CSH-901', total_amount: 22.00, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 22:10:00' },
  { transaction_id: 1021, register_id: 214, store_id: 108, cashier_id: 'CSH-901', total_amount: 412.00, payment_method: 'CREDIT', status: 'REFUNDED', created_at: '2026-09-29 22:18:40' },
  { transaction_id: 1022, register_id: 215, store_id: 108, cashier_id: 'CSH-902', total_amount: 95.00, payment_method: 'DEBIT', status: 'FAILED', created_at: '2026-09-29 20:55:00' },
  { transaction_id: 1023, register_id: 215, store_id: 108, cashier_id: 'CSH-902', total_amount: 130.00, payment_method: 'CREDIT', status: 'FAILED', created_at: '2026-09-29 21:00:15' },
  { transaction_id: 1024, register_id: 216, store_id: 109, cashier_id: 'CSH-301', total_amount: 75.50, payment_method: 'CREDIT', status: 'PENDING_SYNC', created_at: '2026-09-29 22:15:00' },
  { transaction_id: 1025, register_id: 217, store_id: 110, cashier_id: 'CSH-201', total_amount: 299.99, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:45:00' },
  { transaction_id: 1026, register_id: 218, store_id: 111, cashier_id: 'CSH-111', total_amount: 620.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:30:00' },
  { transaction_id: 1027, register_id: 218, store_id: 111, cashier_id: 'CSH-111', total_amount: 18.50, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 22:35:10' },
  { transaction_id: 1028, register_id: 219, store_id: 111, cashier_id: 'CSH-112', total_amount: 45.00, payment_method: 'DEBIT', status: 'COMPLETED', created_at: '2026-09-29 22:38:00' },
  { transaction_id: 1029, register_id: 220, store_id: 111, cashier_id: 'CSH-113', total_amount: 850.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:42:00' },
  { transaction_id: 1030, register_id: 221, store_id: 112, cashier_id: 'CSH-121', total_amount: 115.00, payment_method: 'MOBILE_PAY', status: 'COMPLETED', created_at: '2026-09-29 22:48:00' },
  { transaction_id: 1031, register_id: 224, store_id: 114, cashier_id: 'CSH-141', total_amount: 210.00, payment_method: 'CREDIT', status: 'PENDING_SYNC', created_at: '2026-09-29 22:20:00' },
  { transaction_id: 1032, register_id: 225, store_id: 115, cashier_id: 'CSH-151', total_amount: 34.99, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 22:50:00' },
  { transaction_id: 1033, register_id: 226, store_id: 116, cashier_id: 'CSH-161', total_amount: 720.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:52:00' },
  { transaction_id: 1034, register_id: 227, store_id: 117, cashier_id: 'CSH-171', total_amount: 92.50, payment_method: 'DEBIT', status: 'COMPLETED', created_at: '2026-09-29 22:54:00' },
  { transaction_id: 1035, register_id: 229, store_id: 119, cashier_id: 'CSH-191', total_amount: 1250.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:55:00' },
  { transaction_id: 1036, register_id: 230, store_id: 120, cashier_id: 'CSH-202', total_amount: 68.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:56:00' },
  { transaction_id: 1037, register_id: 231, store_id: 121, cashier_id: 'CSH-211', total_amount: 312.40, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:45:10' },
  { transaction_id: 1038, register_id: 232, store_id: 121, cashier_id: 'CSH-212', total_amount: 28.50, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 22:48:30' },
  { transaction_id: 1039, register_id: 233, store_id: 122, cashier_id: 'CSH-221', total_amount: 145.00, payment_method: 'DEBIT', status: 'COMPLETED', created_at: '2026-09-29 22:32:00' },
  { transaction_id: 1040, register_id: 234, store_id: 122, cashier_id: 'CSH-222', total_amount: 410.00, payment_method: 'CREDIT', status: 'PENDING_SYNC', created_at: '2026-09-29 19:40:00' },
  { transaction_id: 1041, register_id: 235, store_id: 123, cashier_id: 'CSH-231', total_amount: 89.00, payment_method: 'MOBILE_PAY', status: 'COMPLETED', created_at: '2026-09-29 22:51:15' },
  { transaction_id: 1042, register_id: 236, store_id: 124, cashier_id: 'CSH-241', total_amount: 512.20, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:53:00' },
  { transaction_id: 1043, register_id: 237, store_id: 124, cashier_id: 'CSH-242', total_amount: 76.80, payment_method: 'GIFT_CARD', status: 'COMPLETED', created_at: '2026-09-29 22:54:10' },
  { transaction_id: 1044, register_id: 238, store_id: 125, cashier_id: 'CSH-251', total_amount: 185.00, payment_method: 'CREDIT', status: 'PENDING_SYNC', created_at: '2026-09-29 17:10:00' },
  { transaction_id: 1045, register_id: 239, store_id: 125, cashier_id: 'CSH-252', total_amount: 92.00, payment_method: 'DEBIT', status: 'PENDING_SYNC', created_at: '2026-09-29 17:12:30' },
  { transaction_id: 1046, register_id: 240, store_id: 101, cashier_id: 'CSH-404', total_amount: 630.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:55:00' },
  { transaction_id: 1047, register_id: 201, store_id: 101, cashier_id: 'CSH-401', total_amount: 4.50, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 22:56:10' },
  { transaction_id: 1048, register_id: 202, store_id: 101, cashier_id: 'CSH-402', total_amount: 1850.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:57:00' },
  { transaction_id: 1049, register_id: 208, store_id: 104, cashier_id: 'CSH-601', total_amount: 120.00, payment_method: 'CREDIT', status: 'FAILED', created_at: '2026-09-29 22:42:00' },
  { transaction_id: 1050, register_id: 216, store_id: 109, cashier_id: 'CSH-301', total_amount: 230.50, payment_method: 'CREDIT', status: 'PENDING_SYNC', created_at: '2026-09-29 22:28:00' },
  { transaction_id: 1051, register_id: 220, store_id: 111, cashier_id: 'CSH-113', total_amount: 75.00, payment_method: 'MOBILE_PAY', status: 'VOIDED', created_at: '2026-09-29 22:45:00' },
  { transaction_id: 1052, register_id: 221, store_id: 112, cashier_id: 'CSH-121', total_amount: 340.00, payment_method: 'CREDIT', status: 'COMPLETED', created_at: '2026-09-29 22:52:10' },
  { transaction_id: 1053, register_id: 226, store_id: 116, cashier_id: 'CSH-161', total_amount: 110.00, payment_method: 'DEBIT', status: 'COMPLETED', created_at: '2026-09-29 22:55:40' },
  { transaction_id: 1054, register_id: 229, store_id: 119, cashier_id: 'CSH-191', total_amount: 45.00, payment_method: 'CASH', status: 'COMPLETED', created_at: '2026-09-29 22:58:10' },
  { transaction_id: 1055, register_id: 230, store_id: 120, cashier_id: 'CSH-202', total_amount: 195.00, payment_method: 'CREDIT', status: 'REFUNDED', created_at: '2026-09-29 22:58:45' }
];

export const mockErrorLogs = [
  { log_id: 5001, store_id: 101, register_id: 201, error_code: 'ERR_PAYMENT_DECLINE', error_message: 'Gateway issuer decline code 05: Do Not Honor', severity: 'WARN', occurred_at: '2026-09-29 20:20:46' },
  { log_id: 5002, store_id: 101, register_id: 203, error_code: 'ERR_SYNC_TIMEOUT', error_message: 'Batch synchronization socket timeout after 30000ms', severity: 'CRITICAL', occurred_at: '2026-09-29 19:19:00' },
  { log_id: 5003, store_id: 101, register_id: 203, error_code: 'ERR_DB_LOCK', error_message: 'SQLite database locked by worker process #142', severity: 'FATAL', occurred_at: '2026-09-29 19:20:05' },
  { log_id: 5004, store_id: 102, register_id: 204, error_code: 'ERR_PRINTER_OFFLINE', error_message: 'Epson TM-T88VI receipt printer paper low / cover open', severity: 'INFO', occurred_at: '2026-09-29 20:45:10' },
  { log_id: 5005, store_id: 103, register_id: 206, error_code: 'ERR_SERVER_UNREACHABLE', error_message: 'Store main server 10.103.0.5 connection refused', severity: 'FATAL', occurred_at: '2026-09-29 18:13:00' },
  { log_id: 5006, store_id: 103, register_id: 207, error_code: 'ERR_SERVER_UNREACHABLE', error_message: 'Store main server 10.103.0.5 connection refused', severity: 'FATAL', occurred_at: '2026-09-29 18:14:00' },
  { log_id: 5007, store_id: 104, register_id: 208, error_code: 'ERR_PAYMENT_GATEWAY_TIMEOUT', error_message: 'Payment terminal gateway response timeout (>45s)', severity: 'CRITICAL', occurred_at: '2026-09-29 21:30:25' },
  { log_id: 5008, store_id: 104, register_id: 208, error_code: 'ERR_PAYMENT_GATEWAY_TIMEOUT', error_message: 'Payment terminal gateway response timeout (>45s)', severity: 'CRITICAL', occurred_at: '2026-09-29 21:32:05' },
  { log_id: 5009, store_id: 104, register_id: 209, error_code: 'ERR_SYNC_TIMEOUT', error_message: 'Failed to upload offline transaction envelope #4410', severity: 'WARN', occurred_at: '2026-09-29 20:15:00' },
  { log_id: 5010, store_id: 106, register_id: 212, error_code: 'ERR_NETWORK_DISCONNECTED', error_message: 'NIC link down detected on eth0', severity: 'CRITICAL', occurred_at: '2026-09-29 14:22:15' },
  { log_id: 5011, store_id: 108, register_id: 215, error_code: 'ERR_DRAWER_JAM', error_message: 'APG cash drawer solenoid kick feedback signal missing', severity: 'WARN', occurred_at: '2026-09-29 20:54:10' },
  { log_id: 5012, store_id: 108, register_id: 215, error_code: 'ERR_AUTH_EXPIRED', error_message: 'Cashier session JWT token expired during tender', severity: 'WARN', occurred_at: '2026-09-29 21:00:16' },
  { log_id: 5013, store_id: 109, register_id: 216, error_code: 'ERR_SYNC_TIMEOUT', error_message: 'Upstream cloud API HTTP 504 Gateway Timeout during sync', severity: 'CRITICAL', occurred_at: '2026-09-29 22:20:00' },
  { log_id: 5014, store_id: 109, register_id: 216, error_code: 'ERR_SYNC_TIMEOUT', error_message: 'Upstream cloud API HTTP 504 Gateway Timeout during sync', severity: 'CRITICAL', occurred_at: '2026-09-29 22:24:30' },
  { log_id: 5015, store_id: 111, register_id: 218, error_code: 'ERR_BARCODE_NOT_FOUND', error_message: 'SKU #88094191 not found in local cache database', severity: 'INFO', occurred_at: '2026-09-29 22:31:00' },
  { log_id: 5016, store_id: 113, register_id: 222, error_code: 'ERR_SERVER_UNREACHABLE', error_message: 'Store main server 10.113.0.5 connection refused', severity: 'FATAL', occurred_at: '2026-09-29 16:44:00' },
  { log_id: 5017, store_id: 114, register_id: 224, error_code: 'ERR_SYNC_TIMEOUT', error_message: 'Cloud sync buffer overflow after 5 retries', severity: 'CRITICAL', occurred_at: '2026-09-29 22:22:10' },
  { log_id: 5018, store_id: 118, register_id: 228, error_code: 'ERR_DB_LOCK', error_message: 'Unsettled batch transaction lock timeout on master SQLite DB', severity: 'FATAL', occurred_at: '2026-09-29 11:12:00' },
  { log_id: 5019, store_id: 119, register_id: 229, error_code: 'ERR_PRINTER_OFFLINE', error_message: 'Receipt thermal cutter jam detected on lane #REG-119-01', severity: 'WARN', occurred_at: '2026-09-29 22:50:15' },
  { log_id: 5020, store_id: 122, register_id: 234, error_code: 'ERR_SYNC_TIMEOUT', error_message: 'Batch synchronization socket timeout after 30000ms', severity: 'CRITICAL', occurred_at: '2026-09-29 19:42:00' },
  { log_id: 5021, store_id: 125, register_id: 238, error_code: 'ERR_SERVER_UNREACHABLE', error_message: 'Store main server 10.125.0.5 connection refused', severity: 'FATAL', occurred_at: '2026-09-29 17:16:00' },
  { log_id: 5022, store_id: 125, register_id: 239, error_code: 'ERR_SERVER_UNREACHABLE', error_message: 'Store main server 10.125.0.5 connection refused', severity: 'FATAL', occurred_at: '2026-09-29 17:18:10' },
  { log_id: 5023, store_id: 104, register_id: 208, error_code: 'ERR_PAYMENT_GATEWAY_TIMEOUT', error_message: 'Payment terminal gateway response timeout (>45s)', severity: 'CRITICAL', occurred_at: '2026-09-29 22:42:15' },
  { log_id: 5024, store_id: 101, register_id: 201, error_code: 'ERR_BARCODE_NOT_FOUND', error_message: 'SKU #49021819 not found in pricing engine lookup', severity: 'INFO', occurred_at: '2026-09-29 21:12:00' },
  { log_id: 5025, store_id: 110, register_id: 217, error_code: 'ERR_DRAWER_JAM', error_message: 'Cash drawer latch stuck on open kick sequence', severity: 'WARN', occurred_at: '2026-09-29 22:10:40' },
  { log_id: 5026, store_id: 116, register_id: 226, error_code: 'ERR_PRINTER_OFFLINE', error_message: 'Receipt thermal paper out condition detected', severity: 'INFO', occurred_at: '2026-09-29 22:30:15' },
  { log_id: 5027, store_id: 121, register_id: 231, error_code: 'ERR_AUTH_EXPIRED', error_message: 'Supervisor authorization token signature expired', severity: 'WARN', occurred_at: '2026-09-29 22:35:00' },
  { log_id: 5028, store_id: 123, register_id: 235, error_code: 'ERR_PAYMENT_DECLINE', error_message: 'Gateway issuer decline code 51: Insufficient funds', severity: 'WARN', occurred_at: '2026-09-29 22:49:10' }
];

export const mockDatabaseSchema = [
  {
    table: 'Stores',
    description: 'Central store and server infrastructure status across all retail branches',
    columns: [
      { name: 'store_id', type: 'INT', isPrimary: true, description: 'Unique Store Identifier (e.g. 101)' },
      { name: 'store_name', type: 'STRING', description: 'Store branch name (e.g. Metro Flagship Downtown)' },
      { name: 'city', type: 'STRING', description: 'City location' },
      { name: 'state', type: 'STRING', description: '2-letter State code (e.g. WA, OR, CA)' },
      { name: 'server_ip', type: 'STRING', description: 'On-prem store controller IP (e.g. 10.101.0.5)' },
      { name: 'server_status', type: 'STRING', description: 'ONLINE | OFFLINE | DEGRADED' },
      { name: 'last_heartbeat', type: 'DATETIME', description: 'Last ping timestamp (YYYY-MM-DD HH:MM:SS)' }
    ]
  },
  {
    table: 'Registers',
    description: 'Point-of-Sale (POS) lanes, hardware models, and OS details',
    columns: [
      { name: 'register_id', type: 'INT', isPrimary: true, description: 'Unique Register Terminal ID (e.g. 201)' },
      { name: 'store_id', type: 'INT', isForeign: true, references: 'Stores.store_id', description: 'Associated store ID' },
      { name: 'terminal_number', type: 'STRING', description: 'Display lane tag (e.g. REG-101-01)' },
      { name: 'model', type: 'STRING', description: 'Hardware model (e.g. Verifone M400, NCR, Ingenico, Toshiba)' },
      { name: 'os_version', type: 'STRING', description: 'Operating system installed on terminal' },
      { name: 'is_online', type: 'INT', description: '1 = Online / Active, 0 = Disconnected' },
      { name: 'last_sync', type: 'DATETIME', description: 'Last transaction sync timestamp' }
    ]
  },
  {
    table: 'Transactions',
    description: 'Point-of-Sale purchase events and settlement statuses',
    columns: [
      { name: 'transaction_id', type: 'INT', isPrimary: true, description: 'Unique Transaction identifier' },
      { name: 'register_id', type: 'INT', isForeign: true, references: 'Registers.register_id', description: 'Register lane that generated the sale' },
      { name: 'store_id', type: 'INT', isForeign: true, references: 'Stores.store_id', description: 'Store where sale took place' },
      { name: 'cashier_id', type: 'STRING', description: 'Employee cashier code (e.g. CSH-401)' },
      { name: 'total_amount', type: 'DECIMAL', description: 'Total charge amount in USD' },
      { name: 'payment_method', type: 'STRING', description: 'CREDIT | DEBIT | CASH | GIFT_CARD | MOBILE_PAY' },
      { name: 'status', type: 'STRING', description: 'COMPLETED | FAILED | PENDING_SYNC | VOIDED | REFUNDED' },
      { name: 'created_at', type: 'DATETIME', description: 'Timestamp of transaction attempt' }
    ]
  },
  {
    table: 'ErrorLogs',
    description: 'System, hardware, network, and payment exceptions',
    columns: [
      { name: 'log_id', type: 'INT', isPrimary: true, description: 'Unique log entry ID' },
      { name: 'store_id', type: 'INT', isForeign: true, references: 'Stores.store_id', description: 'Store identifier' },
      { name: 'register_id', type: 'INT', isForeign: true, references: 'Registers.register_id', description: 'Register terminal ID' },
      { name: 'error_code', type: 'STRING', description: 'Standardized POS error code' },
      { name: 'error_message', type: 'STRING', description: 'Diagnostic error explanation' },
      { name: 'severity', type: 'STRING', description: 'INFO | WARN | CRITICAL | FATAL' },
      { name: 'occurred_at', type: 'DATETIME', description: 'Incident timestamp' }
    ]
  }
];

export const posDocumentation = {
  overview: 'The enterprise Point-of-Sale architecture connects local register lanes to an in-store on-premise controller server (Stores.server_ip). The controller batches transactions and syncs them upstream to enterprise cloud payment and inventory gateways.',
  
  errorCodes: [
    {
      code: 'ERR_SYNC_TIMEOUT',
      severity: 'CRITICAL',
      title: 'Batch Sync Socket Timeout',
      description: 'POS terminal fails to upload offline transactions to the in-store server or cloud API within the 30-second socket window.',
      procedure: '1. Check register LAN connectivity (ping 10.x.0.5). 2. Verify server service `pos-sync.service` is active. 3. Query Transactions WHERE status = "PENDING_SYNC" to check backlog depth.',
      sqlCheck: "SELECT register_id, COUNT(*) AS pending_count FROM Transactions WHERE status = 'PENDING_SYNC' GROUP BY register_id;"
    },
    {
      code: 'ERR_PAYMENT_GATEWAY_TIMEOUT',
      severity: 'CRITICAL',
      title: 'Payment Terminal Gateway Timeout',
      description: 'The PIN pad reader failed to receive an authorization response from the payment acquirer gateway within 45s.',
      procedure: '1. Inspect outbound firewall port 443 to payment endpoints. 2. Check cashier logs for voided attempts. 3. Reconcile FAILED credit card records against merchant portal.',
      sqlCheck: "SELECT transaction_id, register_id, total_amount, created_at FROM Transactions WHERE status = 'FAILED' AND payment_method = 'CREDIT';"
    },
    {
      code: 'ERR_SERVER_UNREACHABLE',
      severity: 'FATAL',
      title: 'Store Controller Server Unreachable',
      description: 'Store controller server is powered down or network interface is severed, cutting off all lane terminals.',
      procedure: '1. Verify Stores.server_status = "OFFLINE". 2. Dispatch local store lead to inspect server rack power & LEDs. 3. Place lanes into offline standalone mode.',
      sqlCheck: "SELECT store_id, store_name, server_ip, last_heartbeat FROM Stores WHERE server_status = 'OFFLINE';"
    },
    {
      code: 'ERR_DB_LOCK',
      severity: 'FATAL',
      title: 'Local SQLite Database Deadlock',
      description: 'SQLite local database file on terminal is deadlocked by concurrent worker threads or hanging sync process.',
      procedure: '1. Kill hanging SQLite worker processes (`killall -9 pos-worker`). 2. Restart terminal POS client software. 3. Verify SQLite journal mode is set to WAL (Write-Ahead-Logging).',
      sqlCheck: "SELECT * FROM ErrorLogs WHERE error_code = 'ERR_DB_LOCK' ORDER BY occurred_at DESC;"
    },
    {
      code: 'ERR_NETWORK_DISCONNECTED',
      severity: 'CRITICAL',
      title: 'Ethernet NIC Link Down',
      description: 'The physical network cable was unplugged or the store switch port flapped down.',
      procedure: '1. Check physical Cat6 patch cable from POS terminal to register jack. 2. Verify link lights on switch. 3. Test ping to default gateway.',
      sqlCheck: "SELECT register_id, store_id, terminal_number FROM Registers WHERE is_online = 0;"
    },
    {
      code: 'ERR_DRAWER_JAM',
      severity: 'WARN',
      title: 'Cash Drawer Solenoid Kick Sensor Error',
      description: 'Cash drawer solenoid kick sensor did not receive microswitch feedback signal after tendering cash.',
      procedure: '1. Check physical key lock position (must be vertical). 2. Verify RJ12 cable between receipt printer kick-out port and drawer solenoid.',
      sqlCheck: "SELECT * FROM ErrorLogs WHERE error_code = 'ERR_DRAWER_JAM' ORDER BY occurred_at DESC;"
    },
    {
      code: 'ERR_AUTH_EXPIRED',
      severity: 'WARN',
      title: 'Cashier / Supervisor JWT Token Expired',
      description: 'Cashier session JWT token expired during tender or manager override was invalid.',
      procedure: '1. Instruct cashier to sign out and re-authenticate. 2. If widespread, verify server NTP clock synchronization.',
      sqlCheck: "SELECT * FROM ErrorLogs WHERE error_code = 'ERR_AUTH_EXPIRED';"
    },
    {
      code: 'ERR_PRINTER_OFFLINE',
      severity: 'INFO',
      title: 'Thermal Receipt Printer Offline / Paper Out',
      description: 'Thermal receipt printer paper is exhausted, cover is unlatched, or USB link dropped.',
      procedure: '1. Replace 80mm thermal paper roll with thermal coating facing sensor. 2. Power cycle printer and verify Windows spooler service.',
      sqlCheck: "SELECT * FROM ErrorLogs WHERE error_code = 'ERR_PRINTER_OFFLINE' ORDER BY occurred_at DESC;"
    },
    {
      code: 'ERR_BARCODE_NOT_FOUND',
      severity: 'INFO',
      title: 'SKU Item Not Found in Local Cache',
      description: 'Scanned barcode SKU is not present in terminal SQLite cache or item catalog is out of sync.',
      procedure: '1. Force catalog refresh from controller server. 2. Check corporate product master catalog if item is new.',
      sqlCheck: "SELECT * FROM ErrorLogs WHERE error_code = 'ERR_BARCODE_NOT_FOUND';"
    },
    {
      code: 'ERR_PAYMENT_DECLINE',
      severity: 'WARN',
      title: 'Issuer Card Payment Declined',
      description: 'Payment authorization declined by card issuing bank (e.g., Code 05: Do Not Honor or Code 51: Insufficient Funds).',
      procedure: '1. Instruct cashier to ask customer for alternative payment method (cash, debit, mobile pay). 2. Do not retry credit repeatedly to avoid merchant penalty.',
      sqlCheck: "SELECT * FROM ErrorLogs WHERE error_code = 'ERR_PAYMENT_DECLINE';"
    }
  ],

  architectureLayers: [
    { 
      layer: 'L1: Terminal Lane Fleet', 
      components: 'Hardware: Verifone M400, NCR RealPOS 70, Ingenico Lane 5000, Toshiba TCxWave. Peripherals: thermal printer, APG cash drawer, Honeywell 2D barcode scanner. OS: Windows 10 IoT / Ubuntu POS 22.04 with local SQLite.' 
    },
    { 
      layer: 'L2: In-Store Controller', 
      components: 'Linux / Windows Store Controller Server (Stores.server_ip 10.x.0.5) hosting local SQL transaction database, batch aggregator, and NTP sync.' 
    },
    { 
      layer: 'L3: Enterprise Core & Gateway', 
      components: 'Payment Acquirer Gateway (First Data / Chase Paymentech), Corporate Inventory SAP, Central Data Warehouse, NOC Datadog Monitoring.' 
    }
  ],

  sopProcedures: [
    {
      id: 'SOP-POS-001',
      title: 'Store Controller Server Outage Triage',
      sla: 'P1 - Resolution < 30m',
      steps: [
        '1. Check Stores table for server_status = "OFFLINE" and review last_heartbeat timestamp.',
        '2. Verify register lanes at this store (Registers WHERE store_id = X) are running in offline buffer mode.',
        '3. Ping server_ip directly. If unreachable, engage On-Site Manager to verify server rack UPS power and LEDs.',
        '4. Once server boots, verify MySQL/SQLite service and ensure `pos-sync` daemon starts receiving buffered transactions.'
      ]
    },
    {
      id: 'SOP-POS-002',
      title: 'Transaction Sync Backlog Reconciliation',
      sla: 'P2 - Resolution < 2h',
      steps: [
        '1. Query Transactions table for status = "PENDING_SYNC" grouped by store_id and register_id.',
        '2. Inspect ErrorLogs table for matching register_id where error_code = "ERR_SYNC_TIMEOUT".',
        '3. If batch size exceeds 500 records, trigger manual chunked sync via POS management portal.',
        '4. Confirm all transactions transition to status = "COMPLETED" without duplicate auth tokens.'
      ]
    },
    {
      id: 'SOP-POS-003',
      title: 'Payment Terminal Gateway Investigation',
      sla: 'P1 - Resolution < 15m',
      steps: [
        '1. Query Transactions WHERE status = "FAILED" AND payment_method = "CREDIT" for current hour.',
        '2. Check ErrorLogs for ERR_PAYMENT_GATEWAY_TIMEOUT occurrences.',
        '3. If failure rate > 50% across multiple stores, escalate to Tier 3 / Merchant Gateway provider status page.',
        '4. Instruct store cashiers to route transactions through secondary PIN pads or switch to debit/cash.'
      ]
    }
  ],

  terminalModels: [
    {
      model: 'Verifone M400',
      os: 'Windows 10 IoT Enterprise',
      defaultPort: 'TCP 8443',
      notes: 'Touchscreen multilane terminal with EMV contact/contactless reader. Requires static IP in VLAN 20.'
    },
    {
      model: 'NCR RealPOS 70',
      os: 'Ubuntu POS 22.04 LTS',
      defaultPort: 'TCP 9000',
      notes: 'Modular high-throughput terminal. Uses SQLite3 WAL mode for local offline transaction caching.'
    },
    {
      model: 'Ingenico Lane 5000',
      os: 'Windows 10 IoT Enterprise',
      defaultPort: 'TCP 5015',
      notes: 'Compact customer-facing terminal. Communicates with store controller via proprietary Telium protocol.'
    },
    {
      model: 'Toshiba TCxWave',
      os: 'Windows 10 IoT Enterprise',
      defaultPort: 'TCP 8080',
      notes: 'All-in-one flagship terminal with integrated magnetic swipe and biometric clerk login.'
    }
  ]
};

export function initializeDatabase() {
  try {
    alasql('DROP TABLE IF EXISTS Stores;');
    alasql('DROP TABLE IF EXISTS Registers;');
    alasql('DROP TABLE IF EXISTS Transactions;');
    alasql('DROP TABLE IF EXISTS ErrorLogs;');

    alasql(`
      CREATE TABLE Stores (
        store_id INT,
        store_name STRING,
        city STRING,
        state STRING,
        server_ip STRING,
        server_status STRING,
        last_heartbeat STRING
      );
    `);

    alasql(`
      CREATE TABLE Registers (
        register_id INT,
        store_id INT,
        terminal_number STRING,
        model STRING,
        os_version STRING,
        is_online INT,
        last_sync STRING
      );
    `);

    alasql(`
      CREATE TABLE Transactions (
        transaction_id INT,
        register_id INT,
        store_id INT,
        cashier_id STRING,
        total_amount NUMBER,
        payment_method STRING,
        status STRING,
        created_at STRING
      );
    `);

    alasql(`
      CREATE TABLE ErrorLogs (
        log_id INT,
        store_id INT,
        register_id INT,
        error_code STRING,
        error_message STRING,
        severity STRING,
        occurred_at STRING
      );
    `);

    alasql.tables.Stores.data = JSON.parse(JSON.stringify(mockStores));
    alasql.tables.Registers.data = JSON.parse(JSON.stringify(mockRegisters));
    alasql.tables.Transactions.data = JSON.parse(JSON.stringify(mockTransactions));
    alasql.tables.ErrorLogs.data = JSON.parse(JSON.stringify(mockErrorLogs));

    // If custom database SQL is stored, execute it on top
    const customSql = localStorage.getItem('support_sql_custom_db_sql');
    if (customSql) {
      const stmts = customSql.split(';').map(s => s.trim()).filter(s => s.length > 5);
      stmts.forEach(stmt => {
        try {
          alasql(stmt + ';');
        } catch (e) {
          console.warn('Custom SQL load warning:', e.message);
        }
      });
    }

    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Failed to initialize AlaSQL database:', error);
    return { success: false, error: error.message };
  }
}

export function applyCustomDatabase(customSql) {
  try {
    if (!customSql || !customSql.trim()) return { success: false, error: 'Empty SQL string.' };
    
    const stmts = customSql.split(';').map(s => s.trim()).filter(s => s.length > 5);
    stmts.forEach(stmt => {
      alasql(stmt + ';');
    });

    localStorage.setItem('support_sql_custom_db_sql', customSql);
    return { success: true };
  } catch (err) {
    console.error('Failed to apply custom database:', err);
    return { success: false, error: err.message };
  }
}

export function clearCustomDatabase() {
  localStorage.removeItem('support_sql_custom_db_sql');
  localStorage.removeItem('support_sql_custom_db_schema');
  return initializeDatabase();
}
