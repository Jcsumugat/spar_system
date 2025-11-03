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
            // Optional: You can add logic before printing
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
                only: [], // Don't reload any data
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
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .permit-container::before {
                        opacity: 0.12;
                    }
                }

                * {
                    font-family: Arial, sans-serif;
                }

                body {
                    background: #f8f9fa;
                    font-family: Arial, sans-serif;
                }

                .permit-container {
                    background: #fff url('/images/tibiao_logo.png') no-repeat center center;
                    background-size: 400px 400px;
                    background-attachment: fixed;
                    background-blend-mode: lighten;
                    opacity: 0.95;
                    max-width: 750px;
                    min-height: 900px;
                    margin: 20px auto;
                    padding: 40px;
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
                    background-size: 400px 400px;
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
                    margin-bottom: 10px;
                }

                .permit-header .header-text {
                    flex: 1;
                    text-align: center;
                }

                .header-text h6 {
                    margin-bottom: 0;
                    font-family: Arial, sans-serif;
                }

                .permit-title {
                    font-size: 28px;
                    font-weight: bold;
                    border: 2px solid #000;
                    display: inline-block;
                    padding: 5px 20px;
                    margin: 30px 0 40px 0;
                    background: #fff;
                    font-family: Arial, sans-serif;
                }

                .content-section {
                    margin-top: 10px;
                }

                .content-section p {
                    margin: 15px 0;
                    line-height: 1.8;
                    font-family: Arial, sans-serif;
                }

                .text-underline {
                    text-decoration: underline;
                }

                .signature {
                    margin-top: 40px;
                }

                .signature p {
                    font-family: Arial, sans-serif;
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
                        width="80"
                    />
                    <div className="header-text">
                        <h6 className="mb-0">Republic of the Philippines</h6>
                        <h6 className="mb-0">Province of Antique</h6>
                        <h6 className="mb-0">MUNICIPALITY OF TIBIAO</h6>
                        <h6>
                            <u>Office of the Municipal Health Officer</u>
                        </h6>
                    </div>
                    <img
                        src="/images/pilipinas_logo.png"
                        alt="Bagong Pilipinas"
                        width="80"
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
                            ? formatDate(permit.issue_date) + ","
                            : "__________"}
                    </p>

                    <p>
                        <strong>DATE OF EXPIRATION:</strong>{" "}
                        <span
                            className="text-underline"
                            style={{ fontWeight: "bold" }}
                        >
                            {permit?.expiry_date
                                ? formatDate(permit.expiry_date) + ","
                                : "__________"}
                        </span>
                    </p>

                    <p style={{ marginTop: "20px" }}>
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
                    <p className="mb-0 mt-4">
                        <strong>JULINETTE JOY D. SALVACION, RN</strong>
                    </p>
                    <p>Sanitation Inspector I</p>
                    <br></br>
                    <p className="mb-0 mt-5">
                        <strong>Approved:</strong>
                    </p>
                    <p className="mb-0 mt-4">
                        <strong>RUE JOANNA F. ESPAÑOLA, M.D.</strong>
                    </p>
                    <p>Municipal Health Officer</p>
                </div>
            </div>
        </>
    );
}
