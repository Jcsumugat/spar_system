import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Print({ permit }) {
    const [printLogged, setPrintLogged] = useState(false);

    useEffect(() => {
        // Auto-print when page loads
        window.print();
    }, []);

    useEffect(() => {
        // Log print after the print dialog is triggered
        const handleAfterPrint = () => {
            if (!printLogged) {
                logPrint();
                setPrintLogged(true);
            }
        };

        const handleBeforePrint = () => {
            console.log("Preparing to print...");
        };

        window.addEventListener("beforeprint", handleBeforePrint);
        window.addEventListener("afterprint", handleAfterPrint);

        return () => {
            window.removeEventListener("beforeprint", handleBeforePrint);
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, [printLogged, permit.id]);

    const logPrint = () => {
        router.post(
            route("permits.log-print", permit.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: [],
                onSuccess: () => {
                    console.log("Print logged successfully");
                },
                onError: (errors) => {
                    console.error("Failed to log print:", errors);
                },
            }
        );
    };

    const handleManualPrint = () => {
        window.print();
    };

    const formatDate = (date) => {
        return new Date(date)
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            .toUpperCase();
    };

    return (
        <>
            <Head title="Print Sanitary Permit" />

            <style>{`
                @media print {
                    @page {
                        size: letter;
                        margin: 0.5in;
                    }

                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 0;
                        padding: 0;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .permit-container {
                        margin: 0 !important;
                        padding: 20px !important;
                        min-height: auto !important;
                        box-shadow: none !important;
                        page-break-inside: avoid;
                    }

                    .permit-container::before {
                        opacity: 0.12;
                    }
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: Arial, sans-serif;
                }

                body {
                    background: #f8f9fa;
                    font-family: Arial, sans-serif;
                }

                .permit-container {
                    background: #fff url('/images/tibiao_logo.png') no-repeat center center;
                    background-size: 350px 350px;
                    background-attachment: fixed;
                    background-blend-mode: lighten;
                    opacity: 0.95;
                    max-width: 750px;
                    margin: 20px auto;
                    padding: 30px;
                    border: 2px solid #000;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    position: relative;
                }

                .permit-container::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: url('/images/tibiao_logo.png') no-repeat center center;
                    background-size: 350px 350px;
                    opacity: 0.2;
                    z-index: 0;
                }

                .permit-container * {
                    position: relative;
                    z-index: 1;
                    font-family: Arial, sans-serif;
                }

                .permit-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }

                .permit-header .header-text {
                    flex: 1;
                    text-align: center;
                }

                .header-text h6 {
                    margin: 5px 0;
                    font-size: 15px;
                    font-family: Arial, sans-serif;
                }

                .permit-title {
                    font-size: 30px;
                    font-weight: bold;
                    border: 2px solid #000;
                    display: inline-block;
                    padding: 10px 30px;
                    margin: 20px 0 40px 0;
                    background: #fff;
                    font-family: Arial, sans-serif;
                }

                .content-section {
                    margin-top: 15px;
                }

                .content-section p {
                    margin: 16px 0;
                    line-height: 1.8;
                    font-size: 15px;
                    font-family: Arial, sans-serif;
                }

                .text-underline {
                    text-decoration: underline;
                }

                .signature {
                    margin-top: 50px;
                }

                .signature p {
                    margin: 6px 0;
                    font-size: 15px;
                    font-family: Arial, sans-serif;
                }

                .signature .signature-name {
                    margin-top: 35px;
                }

                .signature-spacing {
                    margin-top: 25px;
                }
            `}</style>

            <div
                className="no-print"
                style={{
                    textAlign: "center",
                    padding: "20px",
                    maxWidth: "650px",
                    margin: "0 auto",
                }}
            >
                <button
                    onClick={handleManualPrint}
                    style={{
                        padding: "10px 30px",
                        backgroundColor: "#6366f1",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        fontWeight: "500",
                        cursor: "pointer",
                        marginRight: "10px",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    🖨️ Print Permit
                </button>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        padding: "10px 30px",
                        backgroundColor: "#6b7280",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        fontWeight: "500",
                        cursor: "pointer",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    ← Back
                </button>
            </div>

            <div className="permit-container">
                {/* Header */}
                <div className="permit-header">
                    <img
                        src="/images/tibiao_logo.png"
                        alt="Tibiao Logo"
                        width="85"
                    />
                    <div className="header-text">
                        <h6>Republic of the Philippines</h6>
                        <h6>Province of Antique</h6>
                        <h6>MUNICIPALITY OF TIBIAO</h6>
                        <h6>
                            <u>Office of the Municipal Health Officer</u>
                        </h6>
                    </div>
                    <img
                        src="/images/pilipinas_logo.png"
                        alt="Bagong Pilipinas"
                        width="85"
                    />
                </div>

                {/* Title */}
                <div style={{ textAlign: "center" }}>
                    <div className="permit-title">SANITARY PERMIT</div>
                </div>

                {/* Content */}
                <div className="content-section">
                    <p>
                        <strong>ISSUED TO:</strong>{" "}
                        {permit?.business?.owner_name?.toUpperCase() ||
                            "____________________"}
                    </p>

                    <p>
                        <strong>ADDRESS:</strong>{" "}
                        {permit?.business?.address?.toUpperCase() ||
                            "____________________"}
                    </p>

                    <p>
                        <strong>BUSINESS NAME:</strong>{" "}
                        {permit?.business?.business_name?.toUpperCase() ||
                            "____________________"}
                    </p>

                    <p>
                        <strong>SANITARY PERMIT NO.:</strong>{" "}
                        {permit?.permit_number || "__________"}
                    </p>

                    <p>
                        <strong>DATE ISSUED:</strong>{" "}
                        {permit?.issue_date
                            ? formatDate(permit.issue_date)
                            : "__________"}
                    </p>

                    <p>
                        <strong>DATE OF EXPIRATION:</strong>{" "}
                        <span
                            className="text-underline"
                            style={{ fontWeight: "bold" }}
                        >
                            {permit?.expiry_date
                                ? formatDate(permit.expiry_date)
                                : "__________"}
                        </span>
                    </p>

                    <p style={{ marginTop: "22px" }}>
                        This permit is not transferable and will be revoked for
                        violation of the Sanitary Rules, Laws or Regulations of
                        P.D. 522 & P.D. 856 and Pertinent Local Ordinances.
                    </p>
                </div>

                {/* Signatures */}
                <div className="signature">
                    <p>
                        <strong>Recommending approval:</strong>
                    </p>
                    <p className="signature-name" style={{ marginTop: "38px" }}>
                        <strong>JULINETTE JOY D. SALVACION, RN</strong>
                    </p>
                    <p>Sanitation Inspector I</p>

                    <p
                        className="signature-spacing"
                        style={{ marginTop: "40px" }}
                    >
                        <strong>Approved:</strong>
                    </p>
                    <p className="signature-name" style={{ marginTop: "38px" }}>
                        <strong>RUE JOANNA F. ESPAÑOLA, M.D.</strong>
                    </p>
                    <p>Municipal Health Officer</p>
                </div>
            </div>
        </>
    );
}
