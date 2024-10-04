import React, { useState, useEffect, useCallback } from 'react';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import PieChart from "./components/PieChart";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import './App.css';
import { Toggle } from "./components/toggle";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { stateFacts } from './stateFacts';

Chart.register(CategoryScale);

interface State {
  code: string;
  name: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
  }[];
}

interface OverallCounts {
  right: number;
  left: number;
}

const states: State[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
];


function App() {
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Right-handed', 'Left-handed'],
    datasets: [
      {
        label: "Handedness Distribution",
        data: [0, 0],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1"
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

  const [stateCode, setStateCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [overallCounts, setOverallCounts] = useState<OverallCounts>({ right: 0, left: 0 });
  const [showFacts, setShowFacts] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('https://mp2-backend-production.up.railway.app/api/hand-dominance');
      const data = await response.json();
      console.log("Fetched data:", data);

      const overallRight = data.filter((item: { choice: string }) => item.choice === 'right').length;
      const overallLeft = data.filter((item: { choice: string }) => item.choice === 'left').length;

      setOverallCounts({ right: overallRight, left: overallLeft });
      setChartData({
        labels: ['Right-handed', 'Left-handed'],
        datasets: [
          {
            label: "Handedness Distribution",
            data: [overallRight, overallLeft],
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1"
            ],
            borderColor: "black",
            borderWidth: 2
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch handedness data.');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVote = async (choice: string) => {
    if (!stateCode) {
      toast.error('Please select a state.');
      return;
    }
    if (!email) {
      toast.error('Email is required.');
      return;
    }

    try {
      const response = await fetch('https://mp2-backend-production.up.railway.app/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ choice, state: stateCode, email })
      });

      if (response.ok) {
        toast.success('Vote recorded successfully!');
        await fetchData();
        setShowFacts(true);
      } else if (response.status === 409) {
        toast.error('This email has already voted.');
      } else {
        toast.error('Failed to record vote.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const getStateFlag = (stateCode: string): string | null => {
    try {
      return require(`./assets/State Flags/${stateCode.toLowerCase()}.png`);
    } catch (error) {
      console.error(`Error loading flag for ${stateCode}:`, error);
      return null;
    }
  };

  const getStateFacts = (stateCode: string): string[] => {
    const facts = stateFacts[stateCode as keyof typeof stateFacts];
    return facts ? Object.values(facts) : ['No facts available for this state.'];
  };

  return (
    <div className={`App ${isDark ? 'dark-mode' : ''}`}>
      <h1>Handedness Survey</h1>
      <PieChart data={chartData} />
      <div>
        <p>Right-handed: {overallCounts.right}</p>
        <p>Left-handed: {overallCounts.left}</p>
      </div>
      <div>
        <h2>Enter your state and email below</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>{state.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
        </Form>
        <Button variant="primary" onClick={() => handleVote('right')}>Right-handed</Button>{' '}
        <Button variant="secondary" onClick={() => handleVote('left')}>Left-handed</Button>
      </div>
      {showFacts && stateCode && (
        <Accordion defaultActiveKey="0" className="mt-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              Facts about {states.find(state => state.code === stateCode)?.name}
              {getStateFlag(stateCode) && <img src={getStateFlag(stateCode)!} alt={`${stateCode} flag`} style={{ width: '30px', marginLeft: '10px' }} />}
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                {getStateFacts(stateCode).map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
      <Toggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} label="Dark Mode" />
      <ToastContainer />
    </div>
  );
}

export default App;