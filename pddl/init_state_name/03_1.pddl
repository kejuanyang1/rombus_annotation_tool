(define (problem scene1)
  (:domain manip)
  (:objects
    banana_1 banana_2 - item
    potato - item
    garlic - item
    blue basket - container
  )
  (:init
    (ontable banana_1)
    (ontable banana_2)
    (ontable garlic)
    (in potato blue basket)
    (closed blue basket)
    (clear banana_1)
    (clear banana_2)
    (clear garlic)
    (handempty)
  )
  (:goal (and ))
)