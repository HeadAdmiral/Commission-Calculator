# Commission Calculator
The purpose of this calculator is to provide employees with an idea of how much they are making per hour, so they can more accurately gauge how they are doing on a particular day.

When a user inputs sales information from Sales Lookup, the following happens:

  1. Each transaction is turned into an object, with the same properties that each line in Sales Lookup has.
  2. The calculator then goes through each transaction and calculates the commission of each item based on its price.
  3. Earned commission is then grouped into categories (items under $10, items under $100, items over $100).
  4. Statistics about the user's sales (such as percentage of sales in each commission category) are then calculated.
  
  Once all calculations are complete, the form disappears from the page, and the output dialog appears. The user's estimated hourly wage is displayed here. The user can also press the '+' button to show additional statistics about their sales.
  
The process for calculating commission varies by department.

## General Sales

In General Sales, commission is calculated on a per-item basis. The commission rates are as follows:
  * $9.99 and under: 6%
  * $99.99 and under: 3%
  * $100.00 and up: 1.5%
  * Service plans: 10%
  * Items not in department: 0.75%
  


## Build Your Own

In Build Your Own, commission is calculated on a transaction-wide basis. Products are put into two categories: primary and secondary. If a transaction has a processor, the processor is automatically considered a primary item. The highest priced product with a price higher than the processor also becomes a primary item, if it exists. If a transaction doesn't have a processor on it, the highest priced item on the ticket becomes the primary item. All other items are considered secondary.

  * Primary items: 1.5% commission
  * Secondary items: 2.5% commission

## Systems

In Systems, commission is a flat-percentage for all items. The rate is calculated based on a rolling eight week basis, which takes into consideration margin of items sold and attachment rate, among other factors. Therefore each item on a transaction is multiplied by the same flat commission rate.
