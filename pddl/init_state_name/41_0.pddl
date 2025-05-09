(define (problem scene1)
  (:domain manip)
  (:objects
    small red cube - support
    small red triangular prism_1 small red triangular prism_2 - item
    flat yellow block_1 flat yellow block_2 - support
    small blue triangular prism_1 small blue triangular prism_2 - item
    long green block - support
    flat green block_1 flat green block_2 - support
    big green shopping basket yellow basket - container
  )
  (:init
    (ontable small red cube)
    (ontable long green block)
    (ontable flat green block_1)
    (ontable flat green block_2)
    (ontable small blue triangular prism_2)
    (ontable small red triangular prism_2)
    (in small blue triangular prism_1 big green shopping basket)
    (in flat yellow block_1 big green shopping basket)
    (in flat green block_2 big green shopping basket)
    (in small red triangular prism_1 yellow basket)
    (in flat yellow block_2 yellow basket)
    (clear small red cube)
    (clear long green block)
    (clear flat green block_1)
    (clear small blue triangular prism_2)
    (clear small red triangular prism_2)
    (clear big green shopping basket)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)