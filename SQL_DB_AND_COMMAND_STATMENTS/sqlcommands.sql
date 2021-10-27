SELECT Rating.rating, Listing.offer AS Price, Listing.unitType AS Type, Listing.location as Address, Listing.size AS "Size (sqft)",
Listing.description AS Description, Listing.leaseInMonths AS "Lease (Months)", Listing.available AS Available, Owner.username AS Owner
FROM Student
JOIN Listing ON Listing.listingID = Rating.listingID 
JOIN Rating ON Rating.raterID = Student.username
JOIN Owner ON Listing.authorID = Owner.authorID
WHERE Student.username="bsacaze2c"
GROUP BY offer Having offer < Student.budget;

SELECT *
FROM Owner
WHERE authorID IN (SELECT  authorID FROM Listing
   WHERE size=100);

SELECT Listing.*,Student.username, Owner.username FROM Listing
JOIN Student
JOIN Owner ON Owner.authorID= Listing.authorID
WHERE Student.username='Bernard'
GROUP BY offer HAVING Listing.offer <= Student.budget;

SELECT * FROM Listing
JOIN Owner ON Owner.authorID= Listing.authorID
WHERE Listing.description like '/dev/null; touch /tmp/blns.fail ; echo' AND (Listing.leaseInMonths > 6 AND Listing.leaseInMonths < 10);

SELECT message.sender, message.receiver, Student.firstName, Student.lastName, Message.time, Message.message FROM message
JOIN Student ON Student.username=Message.sender
WHERE Message.sender='mblackshawo' AND message.message Like '%Duis%';

SELECT  *,
CASE WHEN Listing.leaseInMonths > 10 THEN 'The lease is longer than one school year'
WHEN leaseInMonths > 5 THEN 'The lease is longer than one semester' 
WHEN leaseInMonths IS NULL THEN ''
ELSE 'The lease is shorter than one semester'
END AS 'Lease Term'
FROM Listing;
