(define (problem scene1)
  (:domain manip)
  (:objects
    white tape - item
    black pen - item
    scissors - item
    scrapper - item
    pink basket - container
    blue basket - container
  )
  (:init
    (in white tape pink basket)
    (ontable black pen)
    (ontable scissors)
    (in scrapper blue basket)
    (closed pink basket)
    (closed blue basket)
    (clear white tape)
    (clear black pen)
    (clear scissors)
    (clear scrapper)
    (handempty)
  )
  (:goal (and ))
)