const menuItemReviewFixtures = {

  oneMenuItemReview: {
    id: 1,
    itemId: 1,
    reviewerEmail: "oyararbas@ucsb.edu",
    stars: 5,
    dateReviewed: "2025-10-28T20:55:30",
    comments: "Amazing!"
  },

  /*
{
    "id": 1,
    "itemId": 1,
    "reviewerEmail": "oyararbas@ucsb.edu",
    "stars": 5,
    "dateReviewed": "2025-10-28T20:55:30",
    "comments": "Amazing!"
  },
  {
    "id": 3,
    "itemId": 3,
    "reviewerEmail": "oyararbas@ucsb.edu",
    "stars": 2,
    "dateReviewed": "2025-10-29T20:55:30",
    "comments": "Terrible..."
  },
  {
    "id": 5,
    "itemId": 1,
    "reviewerEmail": "oyararbas@ucsb.edu",
    "stars": 4,
    "dateReviewed": "2025-10-30T20:55:30",
    "comments": "Alright!"
  }
  */
  threeMenuItemReviews: [
    {
      id: 1,
      itemId: 1,
      reviewerEmail: "oyararbas@ucsb.edu",
      dateReviewed: "2025-10-28T20:55:30",
      stars: 2,
      comments: "Terrible"
    },
    {
      id: 2,
      itemId: 1,
      reviewerEmail: "oyararbas@ucsb.edu",
      dateReviewed: "2025-10-28T20:55:30",
      stars: 2,
      comments: "Terrible"
    },
    {
      id: 3,
      itemId: 4,
      reviewerEmail: "oyararbas@ucsb.edu",
      dateReviewed: "2025-10-30T20:55:30",
      stars: 4,
      comments: "Alright"
    },
  ],
};

export { menuItemReviewFixtures };
