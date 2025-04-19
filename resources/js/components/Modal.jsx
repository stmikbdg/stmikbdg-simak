import { Close, Save } from "@mui/icons-material"
import { Button, CircularProgress, IconButton } from "@mui/material"

export const modal = {
    show: (modalId) => {
        document.getElementById(modalId).showModal()
    },
    close: (modalId) => {
        document.getElementById(modalId).close()
    }
}

export default function Modal({
    children,
    title = 'Modal Title',
    closeButton = true,
    modalId = 'myModalId',
    modalClassname = '',
    modalBoxClassname = '',
    onClose = () => {},
    showTitle = true
}) {

    const handleClose = () => {
        modal.close(modalId)
        onClose()
    }

    return (
        <dialog id={modalId} className={`modal ${modalClassname} z-[990] `}>
            <div className={`modal-box ${modalBoxClassname} rounded-lg bg-white p-0 border-zinc-300`}>
                <div className="bg-zinc-100 px-5 py-3 flex items-center justify-between">
                    {showTitle && (
                        <>
                            <h3 className="font-medium text-lg">
                                {title}
                            </h3>
                            {closeButton && (
                                <form method="dialog">
                                    <IconButton type="button" onClick={handleClose} size="small">
                                        <Close  />
                                    </IconButton>
                                </form>
                            )}
                        </>
                    )}
                </div>
                <hr className="border-zinc-400" />
                {children}
            </div>
        </dialog>
    )
}

export function ModalForm({
    children,
    title = 'Modal Title',
    closeButton = true,
    modalId = 'myModalId',
    modalClassname = '',
    modalBoxClassname = '',
    onClose = () => {},
    showTitle = true,
    error,
    onSubmit = async (event) => {},
    formDisabled,
    loading,
    showSubmitButton = true
}) {

    const handleClose = () => {
        modal.close(modalId)
        onClose()
    }

    return (
        <dialog id={modalId} className={`modal ${modalClassname} z-[990]`}>
            <div className={`modal-box ${modalBoxClassname} rounded-lg bg-white border-2 p-0 border-zinc-300`}>
                <div className="bg-zinc-100 px-5 py-3 flex items-center justify-between">
                    {showTitle && (
                        <>
                            <h3 className="font-medium text-lg">
                                {title}
                            </h3>
                            {closeButton && (
                                <form method="dialog">
                                    <IconButton type="button" onClick={handleClose} size="small">
                                        <Close  />
                                    </IconButton>
                                </form>
                            )}
                        </>
                    )}
                </div>
                <hr className="border-zinc-300" />
                <form onSubmit={onSubmit}>
                    {error && (
                        <>
                            <div className="px-5 py-3">
                                <div className="px-3 py-2 bg-red-700/80 rounded shadow-md text-white">
                                    <p className="font-medium">
                                        Oops, Terdapat Kesalahan!
                                    </p>
                                    <hr className="my-1 opacity-0" />
                                    <p className="opacity-80 text-justify">
                                        {error}
                                    </p>
                                </div>
                            </div>
                            <hr className="border-zinc-300" />
                        </>
                    )}
                    {children}
                    {showSubmitButton && (
                        <>
                            <hr className="border-zinc-300" />
                            <div className="p-5">
                                <Button 
                                    type="submit" 
                                    disabled={(formDisabled) || loading || false} 
                                    variant="contained" 
                                    size="small" 
                                    startIcon={ (loading) || false 
                                        ? <CircularProgress size={15} className=" grayscale" /> 
                                        : <Save fontSize="small" />
                                    }
                                >
                                    Simpan
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </dialog>
    )
}