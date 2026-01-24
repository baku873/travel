import React from 'react';

const CurrencyWidget: React.FC = () => {
  // Валютын тохиргоо: USD, GBP, KRW
  const srcUrl: string = "//monxansh.appspot.com/xansh.html?currency=USD|GBP|KRW&conv_tool=1";

  // CSS styles typed as React.CSSProperties for better type safety
  const containerStyle: React.CSSProperties = {
    width: '230px', 
    margin: '10px'
  };

  const iframeStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  return (
    <div className="currency-container" style={containerStyle}>
      <iframe
        title="Монголбанкны ханш"
        src={srcUrl}
        style={iframeStyle}
        // React attributes (camelCase)
        scrolling="no"
        frameBorder="0"
      />
    </div>
  );
};

export default CurrencyWidget;