import { Head } from "@inertiajs/react";
import { useEffect } from "react";

export default function Print({ permit }) {
    useEffect(() => {
        // Auto-print when page loads
        window.print();
    }, []);

    const formatDate = (date) => {
        return new Date(date)
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            .toUpperCase();
    };

    const getExpiryDate = (issueDate) => {
        const date = new Date(issueDate);
        date.setFullYear(date.getFullYear() + 1);
        return formatDate(date);
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
                }

                body {
                    background: #f8f9fa;
                    font-family: Arial, sans-serif;
                }

                .permit-container {
                    background: #fff;
                    max-width: 800px;
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
                    background-size: 500px 500px;
                    opacity: 0.12;
                    z-index: 0;
                    pointer-events: none;
                }

                .permit-container * {
                    position: relative;
                    z-index: 1;
                }

                .permit-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .permit-header .header-text {
                    flex: 1;
                    text-align: center;
                }

                .header-text h6 {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                }

                .permit-title {
                    font-size: 28px;
                    font-weight: bold;
                    border: 2px solid #000;
                    display: inline-block;
                    padding: 5px 20px;
                    margin: 20px 0;
                    background: #fff;
                }

                .text-underline {
                    text-decoration: underline;
                }

                .signature {
                    margin-top: 50px;
                }

                .signature p {
                    margin: 0;
                }

                .content-section p {
                    margin: 10px 0;
                    line-height: 1.6;
                }
            `}</style>

            {/* Print Button - Hidden on print */}
            <div
                className="no-print"
                style={{
                    textAlign: "center",
                    padding: "20px",
                    maxWidth: "800px",
                    margin: "0 auto",
                }}
            >
                <button
                    onClick={() => window.print()}
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
                        <h6>Republic of the Philippines</h6>
                        <h6>Province of Antique</h6>
                        <h6>MUNICIPALITY OF TIBIAO</h6>
                        <h6 style={{ textDecoration: "underline" }}>
                            Office of the Municipal Health Officer
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

                    <p style={{ marginTop: "30px" }}>
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
                    <p style={{ marginTop: "40px", marginBottom: 0 }}>
                        <strong>JULINETTE JOY D. SALVACION, RN</strong>
                    </p>
                    <p>Sanitation Inspector I</p>

                    <p style={{ marginTop: "50px", marginBottom: 0 }}>
                        <strong>Approved:</strong>
                    </p>
                    <p style={{ marginTop: "40px", marginBottom: 0 }}>
                        <strong>RUE JOANNA F. ESPAÑOLA, M.D.</strong>
                    </p>
                    <p>Municipal Health Officer</p>
                </div>
            </div>
        </>
    );
}
