import { useState, type ChangeEvent, type FormEvent } from 'react'
import './App.css'
import { type ApiRequest, type Complexity } from './models';
import comp2 from './assets/comp2.png'

export const baseUrl = import.meta.env.VITE_APP_GEMINI_API_KEY;

export const fetchApiResponse = async (method: string, url: string, body :string|null = null) => {
  try {
      const response = await (await fetch(url, {
          method: method,
          body: body
      })).json();
      return response;        
  } catch (error) {
      throw error;
  }
}

function App() {
  const [algo, setAlgo] = useState("")
  const [showForm, setShowForm] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [result, setResult] = useState<Complexity>()
  const [showExplanation, setShowExplanation] = useState(false)
  const [textError, setTextError] = useState("")
  
  const handleSubmit = async (e :FormEvent) => {
    e.preventDefault();
    
    if(!algo) {
      setTextError("Please paste the algorithm in the text area")
      return;
    }
    
    setRequesting(true)

    const request : ApiRequest = {
      code: algo
    }

    const res : Complexity = await fetchApiResponse("POST", "https://il3mufptlhwksrnojbzioxha2a0rbfkn.lambda-url.us-east-1.on.aws", JSON.stringify(request));
    setResult(res)
    setShowForm(false)

    setRequesting(false)
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextError("")
    setAlgo(event.target.value);
  };

  const reset = () => {
    setShowForm(true);
    setAlgo("");
    setResult(undefined);
    setShowExplanation(false);
  }

  return (
    <>
    <div className='flex justify-center bg-gray-50'>
      <div className='mb-12 px-12 py-8 w-full h-full rounded'>
        <p className='font-bold text-yellow-500 mb-2 text-lg overline font-mono'>ComplexityCheck</p>
        {showForm && <form onSubmit={handleSubmit}>
          <div className=' mb-2'>
            <p className='text-gray-500 mb-2 text-xs'>Paste your algorithm here:</p>
            <textarea value={algo} onChange={handleChange} className='rounded p-4 border w-full h-64'></textarea>
            {textError && <p className='text-red-500'>{textError}</p>}
          </div>
          <div className='flex justify-end'>
            <button disabled = {requesting} className='bg-yellow-500 rounded p-2 text-white cursor-pointer' type='submit'>{requesting ? 'Analyzing...' : 'Analyze'}</button>            
          </div>
        </form>}

        {result && <div className='overflow-auto'>
            <img src={comp2} alt="complexity diagram" />
            <p className='font-bold mt-2'>Time Complexity: <span className='font-normal'>{result.timeComplexity}</span></p>
            <p className='font-bold'>Space Complexity: <span className='font-normal'>{result.spaceComplexity}</span></p>
            {showExplanation && <p className='font-bold'>Explanation: <span className='font-normal'>{result.explanation}</span></p>}
            <div className='flex justify-between'>
              {!showExplanation && <button className='bg-white border-yellow-500 border rounded text-yellow-500 cursor-pointer p-1 mt-4' onClick={() => setShowExplanation(true)}>See Explanation</button>}
              <button className='bg-white border-red-500 border rounded text-red-500 cursor-pointer p-1 mt-4' onClick={() => reset()}>Reset</button>
            </div>
          </div>}
      </div>
    </div>
    </>
  )
}

export default App
