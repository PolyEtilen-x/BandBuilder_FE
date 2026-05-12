import Skeleton from "@/components/ui/Skeleton/Skeleton";
import "./style.css";

export default function PracticeSkeleton() {
  return (
    <div className="practice-container">
      {/* HEADER */}
      <div className="practice-header" style={{ padding: '0 24px' }}>
        <Skeleton width="200px" height="24px" />
        <Skeleton width="80px" height="24px" borderRadius="12px" />
      </div>

      {/* MAIN  */}
      <div className="practice-main">
        {/* TOOLBAR  */}
        <div className="practice-toolbar" style={{ borderBottom: '1px solid #e2e8f0', padding: '8px 24px', gap: '16px', display: 'flex' }}>
          <Skeleton width="32px" height="32px" borderRadius="4px" />
          <Skeleton width="32px" height="32px" borderRadius="4px" />
          <Skeleton width="32px" height="32px" borderRadius="4px" />
        </div>

        <div className="practice-content-split">
          {/* LEFT PANEL */}
          <div className="practice-left-skeleton">
            <div style={{ padding: '24px' }}>
              <Skeleton width="60%" height="32px" className="mb-6" />
              <Skeleton width="100%" height="20px" className="mb-2" />
              <Skeleton width="100%" height="20px" className="mb-2" />
              <Skeleton width="90%" height="20px" className="mb-8" />

              <Skeleton width="100%" height="200px" className="mb-8" />

              <Skeleton width="100%" height="20px" className="mb-2" />
              <Skeleton width="100%" height="20px" className="mb-2" />
              <Skeleton width="95%" height="20px" className="mb-2" />
              <Skeleton width="80%" height="20px" />
            </div>
          </div>

          {/* DIVIDER */}
          <div className="practice-divider" style={{ cursor: 'default' }} />

          {/* RIGHT PANEL */}
          <div className="practice-right-skeleton">
            <div style={{ padding: '24px' }}>
              <Skeleton width="40%" height="24px" className="mb-6" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="mb-8">
                  <Skeleton width="100%" height="60px" borderRadius="8px" className="mb-3" />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Skeleton width="20px" height="20px" borderRadius="50%" />
                    <Skeleton width="80%" height="20px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="practice-footer" style={{ padding: '0 24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} width="32px" height="32px" borderRadius="4px" />
        ))}
      </div>
    </div>
  );
}
