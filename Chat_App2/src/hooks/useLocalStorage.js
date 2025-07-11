import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  // console.log(key, initialValue);

  // localStorage là một Web Storage API được tích hợp sẵn trong các trình duyệt web hiện đại (như Chrome, Firefox, Edge, v.v.). Nó cho phép bạn lưu trữ dữ liệu dưới dạng cặp key-value (khóa-giá trị) trực tiếp trên trình duyệt của người dùng. Dữ liệu này sẽ tồn tại lâu dài (persistent) cho đến khi được xóa thủ công, ngay cả khi người dùng tắt trình duyệt hoặc khởi động lại máy tính.

  const [storedValue, setStoredValue] = useState(() => {
    // Hàm này chạy một lần khi component mount để lấy giá trị từ localStorage.
    try {
      // lay value tu local storage using key
      const item = window.localStorage.getItem(key);
      // lấy dữ liệu từ localStorage dựa trên key.
      return item ? JSON.parse(item) : initialValue;
      // chuyển dữ liệu từ chuỗi (string) về kiểu dữ liệu gốc : Nếu không có dữ liệu (item là null) hoặc có lỗi, trả về initialValue.
    } catch (error) {
      console.log(error);
      return initialValue
    }
  })



  useEffect(() => {
    // Chạy mỗi khi key hoặc storedValue thay đổi (dependency array: [key, storedValue]). Lưu giá trị mới của storedValue vào localStorage bằng setItem.
    try {
      const valueToStore = typeof storedValue === 'function' ? storedValue(storedValue) : storedValue;
      // Kiểm tra xem storedValue có phải là hàm không (giống cách setState trong React hỗ trợ callback). Nếu là hàm, gọi nó để lấy giá trị; nếu không, dùng trực tiếp storedValue
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue]
}

export default useLocalStorage;