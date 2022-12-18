# Propine

### Overview
This repo aims to parse a large csv file ( approx 1GB) and filter the data based on the requirements.

#### Given scenario for the problem

Let us assume you are a crypto investor. You have made transactions over a period of time which is logged in a CSV file. Write a command line program that does the following

    - Given no parameters, return the latest portfolio value per token in USD.
    - Given a token, return the latest portfolio value for that token in USD.
    - Given a date, return the portfolio value per token in USD on that date.
    - Given a date and a token, return the portfolio value of that token in USD on that date.


#### How to run project

**Important**
Make sure to copy the csv file inside the `src` folder 

1. Git clone repo with following command
    `git clone https://github.com/sumitpatel93/propine`

2. cd to the working directory of repo.
    `cd ~/propine/src`

3. Install the required dependencies with.
   `npm i`

4. Now we are set to run our required queries   with following command.
 `node index.js parameter1 parameter2`

 Example : node index.js 1571967208 ETH

 It will fetch portfolio of ETH in 1571967208(timestamp).

 <img width="652" alt="Screenshot 2022-12-18 at 10 36 30 PM" src="https://user-images.githubusercontent.com/15656052/208310717-9b959265-f5bd-46df-8fb1-ba863052be07.png">
( Here is the picture with all examples and there execution time)


#### Analysis of Project
We were required to parse the csv data given, main issue here is the large file size , so we tried to avoid the `fs.readFile` method from nodejs as it has memory limitation issue while reading the big files.

So we tried to read the file in chunks with  `createReadStream` method and used `csv-parse` npm module to parse the data in the csv file.

Some benefits that we have using *createReadStream* 

    - createReadStream is more memory efficient: When using readFile, the entire contents of the file are read into memory before being returned to the callback function. This can be a problem for very large files, as it can consume a lot of memory. On the other hand, createReadStream reads the file in small chunks, so it uses much less memory.

    - createReadStream is faster: Because createReadStream reads the file in small chunks, it can start returning data to the callback function as soon as it has read the first chunk. This means that createReadStream can start processing the data as soon as it becomes available, rather than having to wait for the entire file to be read into memory.

    - createReadStream can be used to read large files: As mentioned above, readFile can have problems when reading very large files because it reads the entire file into memory. createReadStream, on the other hand, can handle reading very large files because it reads the file in small chunks.

    - createReadStream is more flexible: createReadStream returns a stream object, which can be piped to other streams or used with other stream-based APIs. This allows for more flexibility and power when working with large amounts of data.


#### Time Complexity
The time complexity of program depends on the size of the CSV file and the number of transactions that match the provided date or token.

The time complexity of reading the CSV file and processing the transactions is linear, meaning that it scales linearly with the number of transactions. This is because the script reads each record from the CSV file and processes it one at a time.

The time complexity of calculating the portfolio value in USD is also linear, because it involves iterating over all of the transactions in the portfolio map and calculating the total value of the portfolio for each token.

The time complexity of making requests to the CryptoCompare API to get the exchange rates is also linear, because the script makes one request for each unique token in the portfolio map.

Overall, the time complexity of the program is linear with respect to the number of transactions in the CSV file and the number of unique tokens in the portfolio map.