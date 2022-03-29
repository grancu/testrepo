# Results Evaluation

No performance test is valid without a report and metrics to understand how the application under test is performing. 

However, the environment should also be monitored while performing a Performance Test.  

## Acceptance Performance Testing Monitoring
The aim of the Acceptance Performance Testing is to monitor a single component, part of the system under test. 
It evaluates the new code within a push request or any other early stage of the development,  part of a ci/cd pipeline.
The Acceptance performance testing is part of the shift left initiative. 

During the acceptance performance testing, the amount of load generated is controlled. The aim of this Performance test is to verify that the application under test still performs within a particular reponse time threshold. 
These thresholds can be automated scripted into the code, and the test will fail if these thresholds are not observed. 

Dynatrace would be a great tool to monitor the activity of the Performance Test of different component.  Dynatrace can be configured to monitor the environment, and a dashboard created monitoring the health of the servers, and the load being generated. 
In additional, I suggest adding a dashboard per component, tracking the different apis of that component.  This will be very beneficial for the development team.

## System Performance Testing Monitoring

The aim of the System Performance Testing is to verify the performance of the system as a whole, including how the application under test performs with the environment. 

For this reason, I would suggest running the test daily during which no more development is taking place.

The results are saved in a database, and then rentered using a graphical tool, such as Grafana. 

The results are the compared to each other to form a trend.  Apart from thresholds that could also be scripted into this test, it is important to monitor the trend of the performance over time of the application under test. 

For this stage, the following metrics will be measured:
```
- average response time
- 90th percentile of the response
- 95th percentile of the response
- max response time
- cpu usage
- memory usage
- disk usage
- network usage
```

## Scaling

Given the buisness requiements are always increasing, the application should be tested for scalability, to understand if it can withstand the business requirements to increase traffic/load on the app/website.

Thus, I would suggest to run 4 levels of tests:
```
- 10% of production traffic (this will be used as a control)
- 50%<>70% of production traffic (this will be used to verify the environment)
- 100% of production traffic (this verifies that the application can still withstand the traffic we usually see on prod)
- 120% of production traffic (this verifies how scalable our app is)
- >150%  of production traffic (to catch early issues when scaling)
```
For this stage, the following metrics will be measured:
```
- average response time
- 90th percentile of the response
- 95th percentile of the response
- max response time
- cpu usage
- memory usage
- disk usage
- network usage
```
