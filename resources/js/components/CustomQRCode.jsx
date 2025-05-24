'use client'

import { Html5QrcodeScanner } from "html5-qrcode"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import QrReader from "react-qr-reader"


export default function QRScanner({ 
    onScanned = (data) => {},
    facingMode,
    onError = (error) => {}
}) {
    return (
        <QrReader 
            onScan={(data) => onScanned(data)}
            facingMode={facingMode || 'user'}
            onError={(err) => onError(err)}
        />
    )
}

export const QRScanner2 = ({
    onScanned = (data) => {},
    onError = async (error) => {}
}) => {
    const [qr, setQr] = useState({
        data: null,
        error: null
    })

    const aksi = {
        qr: {
            set: (column, value) => {
                setQr(state => ({
                    ...state,
                    [column]: value
                }))
            },
            onScan: (scannedData) => {
                console.log(scannedData)
                onScanned(scannedData)
            }
        }
    }

    

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('qr-reader', {
            qrbox: {
                width: 250,
                height: 250
            },
            fps: 5
        })

        scanner.render(
            (result) => {
                scanner.clear()
                console.log(result)
            },
            (error) => {
                onError(error)
            }
        )
    }, [])

    return (
        <div id="qr-reader"></div>
    )
}

export const QRMaker = ({
    value = "Test 123"
}) => {
    return (
        <QRCode 
            size={256}
            viewBox={`0 0 256 256`}
            value={value}
        />
    )
}