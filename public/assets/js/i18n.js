// public/assets/js/i18n.js
// Internationalization module — Vietnamese / English

const translations = {
    vi: {
        // Navbar
        home: 'Trang chủ',
        genres: 'Thể loại',
        latest: 'Mới cập nhật',
        ranking: 'Xếp hạng',
        search_placeholder: 'Tìm truyện...',
        library: 'Thư viện',
        personal: 'Cá nhân',
        explore: 'Khám phá',

        // Home
        hot: 'HOT',
        read_now: 'Đọc Ngay',
        latest_releases: 'Mới Cập Nhật',
        see_more: 'Xem thêm',
        popular_this_week: 'Phổ Biến Tuần Này',
        popular_this_month: 'Phổ Biến Tháng Này',
        completed_manga: 'Truyện Hoàn Thành',
        all_manga: 'Tất Cả Truyện',
        chapter_latest: 'Cập nhật chương mới nhất',
        page: 'Trang',
        prev: 'Trước',
        next: 'Sau',

        // Trending / Ranking
        ranking_title: '🏆 Bảng Xếp Hạng',
        ranking_desc: 'Truyện được đọc nhiều nhất.',
        filter_new_manga: 'Truyện Mới',
        filter_ongoing: 'Đang Phát Hành',
        filter_completed: 'Hoàn Thành',
        filter_coming_soon: 'Sắp Ra Mắt',
        chapter_new: 'Chương mới',

        // Genres
        genres_title: 'Thể Loại',
        genres_desc: 'Khám phá truyện theo sở thích.',
        select_genre: 'Chọn thể loại...',
        manga_count: 'truyện',
        no_manga: 'Chưa có truyện nào.',

        // Auth
        login: 'Đăng Nhập',
        register: 'Đăng Ký',
        welcome_back: 'Chào mừng bạn quay lại.',
        create_account: 'Tạo tài khoản mới để bắt đầu.',
        email: 'Email',
        password: 'Mật khẩu',
        confirm_password: 'Xác nhận mật khẩu',
        username: 'Tên người dùng',
        full_name: 'Họ và tên',
        login_btn: 'Đăng nhập',
        register_btn: 'Đăng ký',
        continue_google: 'Tiếp tục với Google',
        or: 'hoặc',
        no_account: 'Chưa có tài khoản?',
        have_account: 'Đã có tài khoản?',
        login_success: 'Đăng nhập thành công',
        register_success: 'Đăng ký thành công',
        branding_title: 'Hàng ngàn bộ truyện',
        branding_highlight: 'chờ bạn khám phá',
        branding_desc: 'Đăng nhập để lưu tiến độ đọc, bình luận và nhận thông báo chương mới.',
        passwords_not_match: 'Mật khẩu không khớp',
        fill_all_fields: 'Vui lòng nhập đầy đủ thông tin',
        forgot_password: 'Quên mật khẩu?',

        // Settings
        settings: 'Cài Đặt',
        guest: 'Khách',
        not_logged_in: 'Chưa đăng nhập',
        appearance: 'Giao diện',
        dark_mode: 'Chế độ tối',
        dark_mode_desc: 'Bật/tắt giao diện tối',
        language: 'Ngôn ngữ',
        language_desc: 'Chọn ngôn ngữ hiển thị',
        reading: 'Đọc truyện',
        read_direction: 'Hướng đọc',
        read_direction_desc: 'Cuộn dọc (Webtoon)',
        vietnamese: 'Tiếng Việt',
        english: 'English',
        logout: 'Đăng xuất',

        // Error
        error_occurred: 'Đã xảy ra lỗi',
        go_home: 'Về trang chủ',
        page_not_found: 'Trang bạn tìm kiếm không tồn tại.',
        error_load_home: 'Lỗi tải trang chủ',
        // Details Page
        read_first_chapter: 'Đọc từ đầu',
        resume_chapter: 'Đọc tiếp Ch.',
        save: 'Lưu',
        saved: 'Đã lưu',
        synopsis: 'Nội dung',
        chapters_list: 'Danh sách chương',
        chapter: 'Chương',
        newest: 'Mới nhất',
        oldest: 'Cũ nhất',
        updating: 'Đang cập nhật...',
        no_synopsis: 'Chưa có nội dung.',
        manga_not_found: 'Không tìm thấy truyện',
        views: 'Lượt xem',
        show_more: 'Nhấn để xem thêm',

        // Reader Page
        error_load_chapter: 'Lỗi tải chương',
        end_of_chapter: 'Hết chương',
        prev_chapter: 'Trước',
        manga_details_page: 'Trang truyện',
        chapter_not_found: 'Lỗi: Không tìm thấy chương.',

        // Library Page
        reading_tab: 'Đang đọc',
        want_to_read_tab: 'Muốn đọc',
        completed_tab: 'Hoàn thành',
        no_manga_in_library: 'Chưa có truyện nào trong thư viện.',
        empty_reading_title: 'Chưa có truyện đang đọc',
        empty_reading_desc: 'Bắt đầu đọc truyện và tiến trình sẽ được tự động lưu tại đây.',
        empty_want_title: 'Danh sách trống',
        empty_want_desc: 'Thêm truyện vào danh sách "Muốn đọc" từ trang chi tiết truyện.',
        empty_completed_title: 'Chưa hoàn thành truyện nào',
        empty_completed_desc: 'Khi bạn đọc hết một bộ truyện, nó sẽ xuất hiện ở đây.',
        explore_now: 'Khám phá ngay',
        continue_reading: 'Đọc tiếp',
        up_next: 'Tiếp theo',
        completed_status: 'Hoàn thành',
        ongoing_status: 'Đang cập nhật',
        updated: 'Cập nhật',
        move_to_reading: 'Chuyển sang Đang đọc',
        move_to_want: 'Muốn đọc',
        mark_completed: 'Đánh dấu Hoàn thành',
        remove: 'Xóa',
        sign_in_library: 'Đăng nhập để xem Thư viện',
        sign_in_library_desc: 'Đăng nhập để lưu tiến độ đọc, tạo danh sách và đồng bộ trên các thiết bị.',
        sign_in: 'Đăng nhập',
        just_now: 'vừa xong',
        m_ago: 'phút trước',
        h_ago: 'giờ trước',
        d_ago: 'ngày trước',
        mo_ago: 'tháng trước'
    },
    en: {
        home: 'Home',
        genres: 'Genres',
        latest: 'Latest',
        ranking: 'Ranking',
        search_placeholder: 'Search manga...',
        library: 'Library',
        personal: 'Profile',
        explore: 'Explore',

        hot: 'HOT',
        read_now: 'Read Now',
        latest_releases: 'Latest Releases',
        see_more: 'See more',
        popular_this_week: 'Popular This Week',
        popular_this_month: 'Popular This Month',
        completed_manga: 'Completed Manga',
        all_manga: 'All Manga',
        chapter_latest: 'Latest chapter update',
        page: 'Page',
        prev: 'Prev',
        next: 'Next',

        ranking_title: '🏆 Rankings',
        ranking_desc: 'Most read manga.',
        filter_new_manga: 'New Manga',
        filter_ongoing: 'Ongoing',
        filter_completed: 'Completed',
        filter_coming_soon: 'Coming Soon',
        chapter_new: 'Latest Ch.',

        genres_title: 'Genres',
        genres_desc: 'Explore manga by your interests.',
        select_genre: 'Select a genre...',
        manga_count: 'manga',
        no_manga: 'No manga found.',

        login: 'Login',
        register: 'Register',
        welcome_back: 'Welcome back.',
        create_account: 'Create a new account to get started.',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm Password',
        username: 'Username',
        full_name: 'Full Name',
        login_btn: 'Login',
        register_btn: 'Register',
        continue_google: 'Continue with Google',
        or: 'or',
        no_account: "Don't have an account?",
        have_account: 'Already have an account?',
        login_success: 'Login successful',
        register_success: 'Registration successful',
        branding_title: 'Thousands of manga',
        branding_highlight: 'waiting for you',
        branding_desc: 'Sign in to save your reading progress, comment and get notified on new chapters.',
        passwords_not_match: 'Passwords do not match',
        fill_all_fields: 'Please fill in all fields',
        forgot_password: 'Forgot Password?',

        settings: 'Settings',
        guest: 'Guest',
        not_logged_in: 'Not logged in',
        appearance: 'Appearance',
        dark_mode: 'Dark Mode',
        dark_mode_desc: 'Toggle dark theme',
        language: 'Language',
        language_desc: 'Choose display language',
        reading: 'Reading',
        read_direction: 'Reading Direction',
        read_direction_desc: 'Vertical Scroll (Webtoon)',
        vietnamese: 'Tiếng Việt',
        english: 'English',
        logout: 'Logout',

        error_occurred: 'An error occurred',
        go_home: 'Go Home',
        page_not_found: 'The page you are looking for does not exist.',
        error_load_home: 'Error loading home page',

        // Details Page
        read_first_chapter: 'Read First Chapter',
        resume_chapter: 'Resume Ch.',
        save: 'Save',
        saved: 'Saved',
        synopsis: 'Synopsis',
        chapters_list: 'Chapters',
        chapter: 'Chapter',
        newest: 'Newest First',
        oldest: 'Oldest First',
        updating: 'Updating...',
        no_synopsis: 'No synopsis available.',
        manga_not_found: 'Manga not found',
        views: 'Views',
        show_more: 'Click to show more',

        // Reader Page
        error_load_chapter: 'Error loading chapter',
        end_of_chapter: 'End of chapter',
        prev_chapter: 'Prev',
        manga_details_page: 'Manga Details',
        chapter_not_found: 'Error: Chapter not found.',

        // Library Page
        reading_tab: 'Reading',
        want_to_read_tab: 'Want to Read',
        completed_tab: 'Completed',
        no_manga_in_library: 'No manga in library.',
        empty_reading_title: 'No manga reading',
        empty_reading_desc: 'Start reading and your progress will be saved here.',
        empty_want_title: 'List is empty',
        empty_want_desc: 'Add manga to "Want to Read" from the details page.',
        empty_completed_title: 'No completed manga',
        empty_completed_desc: 'When you finish reading a manga, it will appear here.',
        explore_now: 'Explore Now',
        continue_reading: 'Continue Reading',
        up_next: 'Up Next',
        completed_status: 'Completed',
        ongoing_status: 'Ongoing',
        updated: 'Updated',
        move_to_reading: 'Move to Reading',
        move_to_want: 'Want to Read',
        mark_completed: 'Mark Completed',
        remove: 'Remove',
        sign_in_library: 'Sign in to view Library',
        sign_in_library_desc: 'Sign in to save reading progress, create lists, and sync across all your devices.',
        sign_in: 'Sign In',
        just_now: 'just now',
        m_ago: 'm ago',
        h_ago: 'h ago',
        d_ago: 'd ago',
        mo_ago: 'mo ago'
    }
};

class I18n {
    constructor() {
        this.locale = localStorage.getItem('mangaflow_lang') || 'vi';
    }

    setLocale(locale) {
        this.locale = locale;
        localStorage.setItem('mangaflow_lang', locale);
    }

    getLocale() {
        return this.locale;
    }

    t(key) {
        return translations[this.locale]?.[key] || translations['vi']?.[key] || key;
    }
}

export const i18n = new I18n();
