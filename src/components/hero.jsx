import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";


function Hero() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [masuk, setMasuk] = useState(false);
    const [keluar, setKeluar] = useState(true);
    const [transactionType, setTransactionType] = useState("pengeluaran");
    const [selectedCategory, setSelectedCategory] = useState({
    pengeluaran: null,
    pemasukan: null,
    });
    const pengeluaranCategories = [
    { name: "Makanan", icon: "mdi:food" },
    { name: "Belanja", icon: "mdi:shopping" },
    { name: "Transport", icon: "mdi:bus" },
    { name: "Digital", icon: "gridicons:phone"},
    { name: "Aplikasi", icon: "streamline-plump:application-add"},
    { name: "Rumah", icon: "f7:house-fill"},
    { name: "Hiburan", icon: "hugeicons:game"},
    { name: "Berpergian", icon: "mingcute:suitcase-line"},
    { name: "Sosial", icon: "material-symbols:social-distance"},
    { name: "Medis", icon: "streamline-cyber:medical-box"},
    { name: "Lainnya", icon: "weui:more-outlined"},

    ];

    const pemasukanCategories = [
    { name: "Gaji", icon: "mdi:cash" },
    { name: "Bonus", icon: "mdi:gift" },
    { name: "Investasi", icon: "mdi:chart-line" },
    { name: "Tunjangan", icon: "grommet-icons:money"},
    { name: "Angpao", icon: "et:envelope"},
    { name: "Sambilan", icon: "solar:box-linear"},
    { name: "Lainnya", icon: "weui:more-outlined"},

    ];

    const [amount, setAmount] = useState("");
    const handleNumber = (num) => {
    setAmount((prev) => prev + num.toString());
    };

    const handleDelete = () => {
    setAmount((prev) => prev.slice(0, -1));
    };

    const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
    });
    const [note, setNote] = useState("");

    useEffect(() => {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}, [transactions]);


    const handleSave = () => {
        if (!amount) return;

        const transaction = {
            id: Date.now(),
            type: transactionType, // pemasukan / pengeluaran
            category:
            transactionType === "pengeluaran"
                ? pengeluaranCategories[selectedCategory.pengeluaran]?.name
                : pemasukanCategories[selectedCategory.pemasukan]?.name,
            amount: Number(amount),
            note,
            date: new Date(),
        };

        setTransactions((prev) => [...prev, transaction]);

        // reset form
        setAmount("");
        setNote("");
        setSelectedCategory({
            pengeluaran: null,
            pemasukan: null,
        });

        setMenuOpen(false);
        };

        const totalPemasukan = transactions
        .filter((t) => t.type === "pemasukan")
        .reduce((sum, t) => sum + t.amount, 0);

        const totalPengeluaran = transactions
        .filter((t) => t.type === "pengeluaran")
        .reduce((sum, t) => sum + t.amount, 0);

        const sisa = totalPemasukan - totalPengeluaran;

        const groupedTransactions = transactions.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString("id-ID");

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push(item);

        return acc;
    }, {});

    const handleDeleteTransaction = (id) => {
    const confirmDelete = window.confirm(
        "Yakin ingin menghapus transaksi ini?"
    );

    if (!confirmDelete) return;

    setTransactions((prev) =>
        prev.filter((item) => item.id !== id)
    );
};

    return (
        <>
            <header className="text-black bg-white w-screen lg:outline-1 grid grid-cols-1 justify-center lg:w-md  ">
                <section className="bg-blue-500  py-3">
                    <div>
                        <h2 className="flex text-white text-5xl justify-start gap-5">
                            <Icon icon="mdi:paper-outline" className="text-4xl -mt-1" />Catatan
                            Keuangan
                        </h2>
                    </div>
                </section>
                <section className="mt-10 px-3.5 flex justify-center mb-2">
                    <div className="bg-gray-200 w-md py-4 rounded-xl">
                        <h2>sisa anggaran bulanan</h2>
                        <h1>RP. {sisa.toLocaleString("id-ID")}</h1>
                    </div>
                    
                </section>
                <section >
                    <div className="flex gap-1 justify-center">
                        <div className="bg-gray-100 px-9 sm:px-14 py-3 rounded-xl">
                            <p>pemasukan</p>
                            <p className="text-green-600"> Rp. {totalPemasukan.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="bg-gray-100 px-9 sm:px-14 py-3 rounded-xl">
                            <p>pengeluaran</p>
                            <p className="text-red-600">RP. {totalPengeluaran.toLocaleString("id-ID")}</p>
                        </div>
                    </div>
                    <section className="mt-6 px-3 space-y-5">
                    {Object.entries(groupedTransactions)
                        .reverse()
                        .map(([date, items]) => {
                            const pemasukan = items
                                .filter((i) => i.type === "pemasukan")
                                .reduce((a, b) => a + b.amount, 0);

                            const pengeluaran = items
                                .filter((i) => i.type === "pengeluaran")
                                .reduce((a, b) => a + b.amount, 0);

                            return (
                                <div key={date}>
                                    <div className="flex justify-between mb-2 text-gray-500">
                                        <span>{date}</span>

                                        <div className="flex gap-4 text-sm">
                                            <span>
                                                Pengeluaran :
                                                Rp{pengeluaran.toLocaleString("id-ID")}
                                            </span>

                                            <span>
                                                Pemasukan :
                                                Rp{pemasukan.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow border">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center p-4 border-b last:border-b-0"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Icon
                                                        icon={
                                                            item.type === "pengeluaran"
                                                                ? pengeluaranCategories.find(
                                                                    c =>
                                                                        c.name === item.category
                                                                )?.icon ||
                                                                "mdi:cash-remove"
                                                                : pemasukanCategories.find(
                                                                    c =>
                                                                        c.name === item.category
                                                                )?.icon ||
                                                                "mdi:cash-plus"
                                                        }
                                                        width={28}
                                                    />

                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {item.category}
                                                        </h3>

                                                        <p className="text-gray-500 text-sm">
                                                            {item.note}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <h3
                                                        className={`font-bold text-lg ${
                                                            item.type === "pengeluaran"
                                                                ? "text-red-500"
                                                                : "text-green-500"
                                                        }`}
                                                    >
                                                        {item.type === "pengeluaran" ? "-" : "+"}
                                                        Rp{item.amount.toLocaleString("id-ID")}
                                                    </h3>

                                                    <button
                                                        onClick={() => handleDeleteTransaction(item.id)}
                                                        className="w-9 h-9 rounded-full bg-red-100 hover:bg-red-500
                                                                hover:text-white transition flex items-center justify-center"
                                                    >
                                                        <Icon icon="mdi:trash-can-outline" width={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                </section>
                </section>
                <section></section>
                <section>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="floating fixed bottom-5 right-5 -ml-40 bg-blue-500 p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 cursor-pointer z-0"
                    >
                        <Icon icon="ic:baseline-plus" height="2em" className="text-white" />
                    </button>

                    <section
                        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl
                            transition-all duration-500 ease-in-out z-0
                            ${menuOpen
                            ? "translate-y-0 opacity-100"
                            : "translate-y-full opacity-0 pointer-events-none"
                            }`}
                        >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-16 h-1.5 bg-gray-300 rounded-full"></div>
                        </div>                       
                        <div className="px-4 pb-6 overflow-y-auto max-h-[85vh]">
                            <div className="flex justify-center gap-6 mb-5">
                                <button
                                    onClick={() =>{ setKeluar(true);setMasuk(false); setTransactionType("pengeluaran")}}
                                    className={`px-5 py-2 rounded-lg transition
                                    ${
                                        transactionType === "pengeluaran"
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-100"
                                    }`}
                                >
                                    Pengeluaran
                                </button>

                                <button
                                    onClick={() =>{ setMasuk(true);setKeluar(false);; setTransactionType("pemasukan")} }
                                    className={`px-5 py-2 rounded-lg transition
                                    ${
                                        transactionType === "pemasukan"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100"
                                    }`}
                                >
                                    Pemasukan
                                </button>
                            </div>
                            <div
                                className={`transition-all duration-300 ${
                                    keluar ? "block" : "hidden"
                                }`}
                                >
                                <div className="grid grid-cols-4 gap-4 text-black">
                                    {pengeluaranCategories.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedCategory(prev => ({
                                            ...prev,
                                            pengeluaran: index,
                                        }))}
                                        className={`flex flex-col items-center ${
                                        selectedCategory.pengeluaran === index
                                            ? "text-blue-500"
                                            : "text-gray-600 hover:text-blue-500"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full border flex items-center justify-center">
                                        <Icon icon={item.icon} width={20} height={20} />
                                        </div>

                                        <span>{item.name}</span>
                                    </button>
                                    ))}
                                </div>
                                </div>

                                <div
                                className={`transition-all duration-300 ${
                                    masuk ? "block" : "hidden"
                                }`}
                                >
                                <div className="grid grid-cols-4 gap-4 text-black">
                                    {pemasukanCategories.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedCategory(prev => ({
                                            ...prev,
                                            pemasukan: index,
                                        }))}
                                        className={`flex flex-col items-center ${
                                        selectedCategory.pemasukan === index
                                            ? "text-blue-500"
                                            : "text-gray-600 hover:text-blue-500"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full border flex items-center justify-center">
                                        <Icon icon={item.icon} width={20} height={20} />
                                        </div>

                                        <span>{item.name}</span>
                                    </button>
                                    ))}
                                </div>
                                </div>
                                {/* Form Transaksi */}
                                <div className="mt-6 bg-white border rounded-2xl p-4 shadow-sm">

                                {/* Nominal */}
                                <div className="flex justify-between items-center">
                                    <button className="bg-gray-200 px-4 py-2 rounded-lg">
                                    IDR (Rp)
                                    </button>

                                    <h1
                                    className={`text-6xl font-light ${
                                        transactionType === "pengeluaran"
                                        ? "text-red-500"
                                        : "text-green-500"
                                    }`}
                                    >
                                    {amount || 0}
                                    </h1>
                                </div>

                                <hr className="my-4" />

                                {/* Catatan */}
                                <div className="flex gap-3">
                                    <button className="bg-gray-200 px-4 py-2 rounded-lg">
                                    {new Date().toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                    })}
                                    </button>

                                    <input
                                        type="text"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Klik untuk menambahkan catatan"
                                        className="flex-1 bg-gray-100 rounded-lg px-4 outline-none"
                                    />
                                </div>
                                </div>
                                {/* Keypad */}
                                <div className="mt-5 grid grid-cols-4 gap-3">
                                {[1,2,3,4,5,6,7,8,9,".",0].map((num)=>(
                                    <button
                                    key={num}
                                    onClick={() => handleNumber(num)}
                                    className="h-16 rounded-xl border text-2xl hover:bg-gray-100"
                                    >
                                    {num}
                                    </button>
                                ))}
                                <button
                                    onClick={handleDelete}
                                    className="row-span-1 px-5 rounded-xl border"
                                >
                                    <Icon icon="mdi:backspace-outline" width={34}/>
                                </button>
                                
                                <button
                                    onClick={handleSave}
                                    className={`col-span-2 rounded-xl text-white ${
                                        transactionType === "pengeluaran"
                                            ? "bg-red-500"
                                            : "bg-green-500"
                                    }`}
                                >
                                    Simpan
                                </button>

                                <button
                                    className="rounded-xl border"
                                >
                                    <p>
                                    Simpan & Lanjutkan
                                    </p>
                                </button>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="h-16 rounded-xl border flex flex-col items-center justify-center hover:bg-gray-100 transition"
                                >
                                    <Icon
                                        icon="mdi:arrow-left"
                                        width={24}
                                    />

                                    <span className="text-xs mt-1">
                                        Kembali
                                    </span>
                                </button>
                                </div>
                        </div>
                    </section>
                </section>
            </header>
        </>
    );
}

export default Hero;