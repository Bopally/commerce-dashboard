// src/components/Quote.jsx
import React, { useEffect, useState, useRef } from 'react'
import './quotes.css'
import { LoadingSpinner } from './LoadingStates'
import { fetchData } from '../services/api.service'

const Quote = () => {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const initialLoadRef = useRef(false)

  const fetchQuote = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchData('quotes/random')
      setQuote(data)
    } catch (err) {
      console.error('Error fetching quote:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialLoadRef.current) return
    initialLoadRef.current = true
    fetchQuote()
  }, [])

  // Auto-refresh quote every 30 seconds (optional)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!loading && !error) {
        fetchQuote()
      }
    }, 30000)

    return () => clearInterval(intervalId)
  }, [loading, error])

  return (
    <div className="quote-container">
      {loading ? (
        <LoadingSpinner message="Loading inspiration..." />
      ) : error ? (
        <div className="quote-error">
          <p className="quote-error-text">💭</p>
          <p className="quote-error-message">Unable to load quote</p>
          <button className="quote-retry" onClick={fetchQuote}>
            🔄 Try again
          </button>
        </div>
      ) : quote ? (
        <>
          <p className="quote-text">"{quote.quote}"</p>
          <p className="quote-author">— {quote.author}</p>
          <button
            className="quote-refresh-bottom"
            onClick={fetchQuote}
            title="Get new quote"
          >
            🔄 New Quote
          </button>
        </>
      ) : (
        <div className="quote-fallback">
          <p className="quote-text">
            "The best way to predict the future is to create it."
          </p>
          <p className="quote-author">— Peter Drucker</p>
        </div>
      )}
    </div>
  )
}

export default Quote
