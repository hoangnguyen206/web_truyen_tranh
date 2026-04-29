// public/assets/js/components/footer.js

/**
 * Render HTML cho Footer (Global Component)
 * Có thể dễ dàng copy đoạn HTML này dán vào bất kỳ đâu nếu không dùng module
 */
export function renderFooter() {
    return `
    <footer class="bg-[#111827] text-gray-300 py-10 mt-auto border-t border-gray-800 w-full shrink-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <!-- Cột 1: Giới thiệu -->
                <div class="flex flex-col gap-4">
                    <h2 class="text-3xl font-bold text-primary tracking-tight">MangaFlow</h2>
                    <p class="text-sm text-gray-400 leading-relaxed pr-4">
                        Web truyện tranh online phi lợi nhuận, cập nhật nhanh nhất, mang lại trải nghiệm đọc truyện tuyệt vời không quảng cáo. Cùng đắm chìm trong thế giới truyện tranh đa dạng và phong phú.
                    </p>
                </div>

                <!-- Cột 2: Hợp tác & Donate -->
                <div class="flex flex-col gap-5">
                    <!-- Liên kết hợp tác -->
                    <div>
                        <h3 class="text-sm uppercase tracking-wider font-semibold text-gray-500 mb-3">Hợp tác nội dung</h3>
                        <a href="https://www.facebook.com/minh.duong.986753" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-[#1877F2] hover:text-blue-400 transition-colors bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10 w-fit">
                            <!-- Facebook Icon SVG -->
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            <span class="text-sm font-medium">Liên hệ Facebook</span>
                        </a>
                    </div>
                    
                    <!-- Donate QR -->
                    <div>
                        <h3 class="text-sm uppercase tracking-wider font-semibold text-gray-500 mb-3">Ủng hộ nhóm dịch/phát triển</h3>
                        <div class="flex flex-row gap-4 flex-wrap">
                            <!-- QR 1 -->
                            <div class="qr-trigger flex flex-col items-center gap-1.5 group cursor-pointer" data-qr="/assets/images/QR_cua_Hoang.jpg" data-name="Dev Hoàng">
                                <div class="w-16 h-16 rounded-md overflow-hidden bg-white p-1 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:shadow-lg">
                                    <img src="/assets/images/QR_cua_Hoang.jpg" alt="QR Hoàng" class="w-full h-full object-cover pointer-events-none" onerror="this.src='https://placehold.co/100x100?text=QR'">
                                </div>
                                <span class="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">Dev Hoàng</span>
                            </div>
                            
                            <!-- QR 2 -->
                            <div class="qr-trigger flex flex-col items-center gap-1.5 group cursor-pointer" data-qr="/assets/images/QR_cua_Hong.jpg" data-name="Dev Hồng">
                                <div class="w-16 h-16 rounded-md overflow-hidden bg-white p-1 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:shadow-lg">
                                    <img src="/assets/images/QR_cua_Hong.jpg" alt="QR Hồng" class="w-full h-full object-cover pointer-events-none" onerror="this.src='https://placehold.co/100x100?text=QR'">
                                </div>
                                <span class="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">Dev Hồng</span>
                            </div>
                            
                            <!-- QR 3 -->
                            <div class="qr-trigger flex flex-col items-center gap-1.5 group cursor-pointer" data-qr="/assets/images/QR_cua_Duong.jpg" data-name="Dev Dương">
                                <div class="w-16 h-16 rounded-md overflow-hidden bg-white p-1 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:shadow-lg">
                                    <img src="/assets/images/QR_cua_Duong.jpg" alt="QR Dương" class="w-full h-full object-cover pointer-events-none" onerror="this.src='https://placehold.co/100x100?text=QR'">
                                </div>
                                <span class="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">Dev Dương</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cột 3: Thống kê & Thông tin -->
                <div class="flex flex-col gap-4">
                    <h3 class="text-sm uppercase tracking-wider font-semibold text-gray-500 mb-1">THÔNG TIN</h3>
                    
                    <div class="flex flex-col gap-3 bg-white/5 rounded-lg p-4">
                        <!-- Lượt truy cập -->
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-[20px] text-blue-400">visibility</span>
                            <span class="text-sm text-gray-300">Lượt truy cập: 
                                <strong id="total-views" class="text-white font-mono ml-1">Đang tải...</strong>
                            </span>
                        </div>
                        
                        <!-- Đang truy cập -->
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-[20px] text-green-400">group</span>
                            <span class="text-sm text-gray-300">Đang truy cập: 
                                <strong id="online-users" class="text-green-400 font-mono ml-1 animate-pulse">Đang tải...</strong>
                            </span>
                        </div>
                    </div>

                    <div class="mt-auto pt-4 border-t border-gray-800">
                        <p class="text-xs text-gray-500">&copy; 2026 WebTruyen. All rights reserved.</p>
                    </div>
                </div>
                
            </div>
        </div>

        <!-- Modal hiển thị QR phóng to -->
        <div id="qr-modal" class="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
            <div class="relative w-full max-w-sm p-4 flex flex-col items-center scale-95 transition-transform duration-300" id="qr-modal-content">
                <button id="qr-modal-close" class="absolute top-0 right-0 p-2 text-white hover:text-red-500 bg-black/50 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <img id="qr-modal-img" src="" alt="QR" class="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-2xl bg-white p-3">
                <p id="qr-modal-name" class="mt-4 text-xl font-bold text-white uppercase tracking-wider bg-black/50 px-4 py-1 rounded-full"></p>
            </div>
        </div>
    </footer>
    `;
}

/**
 * Khởi tạo các tương tác cho Footer (Fetch API thống kê)
 */
export function initFooterInteractions() {
    fetchStats();
    
    // Logic cho QR Modal
    const qrModal = document.getElementById('qr-modal');
    const qrModalImg = document.getElementById('qr-modal-img');
    const qrModalName = document.getElementById('qr-modal-name');
    const qrModalContent = document.getElementById('qr-modal-content');
    const qrModalClose = document.getElementById('qr-modal-close');
    
    if (qrModal) {
        // Mở Modal
        document.querySelectorAll('.qr-trigger').forEach(trigger => {
            trigger.addEventListener('click', () => {
                qrModalImg.src = trigger.dataset.qr;
                qrModalName.textContent = trigger.dataset.name;
                qrModal.classList.remove('opacity-0', 'pointer-events-none');
                qrModalContent.classList.remove('scale-95');
                qrModalContent.classList.add('scale-100');
            });
        });
        
        // Đóng Modal
        const closeModal = () => {
            qrModal.classList.add('opacity-0', 'pointer-events-none');
            qrModalContent.classList.remove('scale-100');
            qrModalContent.classList.add('scale-95');
            // Đợi animation chạy xong rồi xóa source ảnh (để tránh lỗi chớp ảnh cũ lần mở sau)
            setTimeout(() => { qrModalImg.src = ''; }, 300);
        };
        
        qrModalClose.addEventListener('click', closeModal);
        
        // Bấm ra ngoài ảnh để đóng
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                closeModal();
            }
        });
    }
}

/**
 * Hàm lấy dữ liệu thống kê từ API (Ví dụ)
 */
async function fetchStats() {
    try {
        // TODO: Thay thế URL này bằng API thật của backend
        // const response = await fetch('/api/stats');
        // if (!response.ok) throw new Error('Network response was not ok');
        // const data = await response.json();

        // MOCK DATA (Dữ liệu giả lập chờ API)
        const mockData = {
            totalViews: 1258430,
            onlineUsers: Math.floor(Math.random() * 50) + 120 // Random số người online
        };

        // Hàm format số (VD: 1258430 -> 1.258.430)
        const formatNumber = (num) => new Intl.NumberFormat('vi-VN').format(num);

        // Giả lập delay mạng 500ms
        setTimeout(() => {
            const totalViewsEl = document.getElementById('total-views');
            const onlineUsersEl = document.getElementById('online-users');

            if (totalViewsEl) {
                totalViewsEl.textContent = formatNumber(mockData.totalViews);
            }

            if (onlineUsersEl) {
                onlineUsersEl.textContent = formatNumber(mockData.onlineUsers);
                // Bỏ hiệu ứng nhấp nháy sau khi tải xong
                onlineUsersEl.classList.remove('animate-pulse');
            }
        }, 500);

    } catch (error) {
        console.error('Lỗi khi fetch dữ liệu thống kê Footer:', error);

        // Hiển thị lỗi nếu API sập
        const totalViewsEl = document.getElementById('total-views');
        const onlineUsersEl = document.getElementById('online-users');
        if (totalViewsEl) totalViewsEl.textContent = 'N/A';
        if (onlineUsersEl) {
            onlineUsersEl.textContent = 'N/A';
            onlineUsersEl.classList.remove('animate-pulse');
        }
    }
}
