export default function CollectionStatusAlert({ status, statusType, onDismiss }) {
    if (!status) return null;

    return (
        <div className={`alert alert-${statusType} alert-dismissible`} role="alert">
            {status}
            <button
                className="btn-close"
                type="button"
                aria-label="Close"
                onClick={onDismiss}
            ></button>
        </div>
    );
}
